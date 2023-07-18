# 1. Grundgerüst und Struktur

- Einspeisen der Daten
	- Computergrafik und Bildverarbeitung aus Wikibase
	- Eimi aus eimi.json
	- Für bessere Performance bei Entwicklung beide Datensätze erstmal in ein .json format parsen
	- [!] TODO -> speichern

- [c] Test: zoom macht Knoten detaillierter 
	- Entscheidung dagegen, weil nicht dynamisch
	- wenn man z.B. zwei Knoten und deren Anhang vergleichen will, kann man das nur bei einer gewissen Zoomstufe machen
	- Überblick über Daten wird schwieriger
	- [Beispiel](https://visjs.github.io/vis-network/examples/network/other/clusteringByZoom.html) zum Ausprobieren (siehe: [StackOverFlow](https://stackoverflow.com/questions/42441913/node-clustering-with-cytoscape-js))

- Erste Graphvisualisierung
	- Layout: fCose
	- Anzeige des Kurses als Superknoten
	- Anzeigen nur der wichtigsten Knoten eines Kurses
		- Entscheidung via node.degree(), mit einem Threshold
			- FG: Überkonten sollen Inhalt wiedergeben
		- Restliche Knoten werden geghostet
			- Kleiner, ohne Label, geringere Opacity
	- Anzeige von Materialien mit eine unterschiedlichen icon
	- Verbindung aller Sources mit dem Kursknoten
		- Source = " v with outdegree of 0 -> find origins"
		- Quelle: Graph-based Analysis of Computer Science Curricula for Primary Education, Pasterk, Bollin, S. 5
	-  📷 Beispielbild
		- ![[GraphIT_Layout-Courses-and-nodes-1.png]]
	- Verbindung aller Sinks und der Wichtigsten Themen (degree()) mit dem Kursknoten
	- 📷 Beispielbild
		- ![[GraphIT_Layout-Courses-and-nodes-2.png]]

- Erste Funktionalitäten
	- Doppelklick
		- Öffnet einen Kurs
		- Zeigt, die zusammenhängende Knoten an
			- Zuerst: geöffnete Knoten (ganzes Layout) neu layouten, damit die neuen sichtbaren Knoten eingepasst werden
			- [c] Schlechte Idee: mentale Map wird beschädigt -> der Graph bewegt sich zu viel
		- [I] Lösungsideen
			- [ ] Layout von Anfang an für alle Knoten in der richtigen Größe auslegen
			- [ ] Nur die neuen Knoten expanden -> Also: nur diesen einen Graphbereich layouten
				-  Mit einfachen layout geht das nicht
				-  "expand-collapse" extension
					- target muss zu einem parent werden
				- "layout-utilities" extension
	- Maus-Hover
		- Färbt die nächsten Nachbarn und deren Kanten ein
		- Unterscheidung zwischen incoming und outgoing
		- Hebt target und dessen Label besonders hervor
		- Farben
			- Orange = die Knoten, von denen abgehangen wird
				- Weil nah an Rot und Rot drückt oft Wichtigkeit aus -> Achtung hier
				- bedeutet: Vorwissen
			- Blau = die Knoten, die abhängen
				- im Farbkreis gegenüber + kältere, rühigere Farbe
				- -> Wissen wird nicht vorausgesetzt 
			- Grün = der aktuelle Knoten
				- Zwischen Orange und Blau, aber nicht Gelb (grell + teilweise schlecht zu sehen) oder Lila (sehr nah an Blau und Rot)
			- orange -> grün -> blau
		- 📷 Beispielbild
			- ![[GraphIT_Hover-highlight.png]]
	- Side-Bar (unvollständig)
		- zeigt die Kurse an, wenn sie geöffnet wird
		- sonst noch keine Funktionalität


# 2. Layout und Aussehen

### Probleme mit Layouts - *fCoSE*
- Knoten sind oft sehr nah aneinander und vor allem Label stören das Layout
	- 📷 Beispielbild
		- ![[GraphIT-Inside-Course-Problems 1.png]]
- Graph wird jedes mal neu ausgelegt -> Knoten ändern Position on Reload
	- [?] Lässt sich das Abstellen?
	- [k] man muss die option auch wirklich randomize nennen, und nicht ranomize; 
- Option: Layout mit Parent machen
	- Konten innerhalb Parents oft sehr weit auseinander
	- Lässt sich nicht wirklich ändern
	- 📷 Beispielbild
		- ![[fCoSE-parents.png]]
- [x] Versuch 1: Layout mithilfe von dynamischer `idealEdgeLenght` und `nodeRepulsion`, innerhalb der Layout-Options
	- konnte keine wirkliche Veränderung erkennen
- [x] Versuch 2: *Spread layout* 
	- Ändert nicht wirklich was
	- evtl. nochmal versuchen
	- 📷 Beispielbild
		- ![[GraphIT-spread.png]]
- [x] Versuch 3: *concentric layout*
	- Nicht wirklich das beste für Platzausnutzung
	- 📷 Beispielbild
		- ![[GraphIT_concentric2.png]]
- [ ] ? Versuch 4: *cola*
	- [ ] physics
- [/] Versuch 5: padding around nodes
	- Ändert auch nicht wirklich was
- [x] fCoSE verbessern
	- zwei Layout für inner-/außerhalb eines Kurses
	- innerhalb:
		- Constraint: Position, des Kursknotens immer Mitte vom Screen -> ging nicht
	- außerhalb: Kompletter Graph
		- weniger Zwischenräume
		- geringere Größe von Knoten
	- Mithilfe von:
		- [?] evtl. proportional edgeLength or nodeSeparation, instead of static (currently)
			- [siehe](https://github.com/cytoscape/cytoscape.js-cose-bilkent/issues/27)
		- Mehr Abstand zwischen den einzelnen Nodes
			- 📷 Beispielbild
				- ![[GraphIT-fcose-better.png]]
```ts
/* incremental layout options */
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 20000,
    // Ideal edge (non nested) length
    idealEdgeLength: 250,
    // Divisor to compute edge forces
    edgeElasticity: 0.2,
``` 


- Es gibt eine Option für incremental layouts
	- Bei *fCoSE* kann man einfach in den Layoutoptionen `randomize:false`, schreiben, und dann werden die Knoten nicht wieder an random stellen gelegt, sondern bleiben da wo sie hin sollen
	- Falsch schreiben, kann viel Zeit beim debuggen kosten 🤓
	- Wie es jetzt aussieht: (noch Layout-verbesserung)
		- 📷 Beispielbilder
			- ![[GraphIT-random-false.png]]
			- ![[GraphIT-random-false2 1.png]]
	- Man kann sich zwar ein layout als variable speichern, und dass dann später wieder .run() en, aber wegen dem randomize:false ist das egal

- [?] Unterscheidung Ressourcen
	- Anfangs: mit svg dargestellt
	- [?] Wann/Wo anzeigen
		- direkt im Graph
		- in einem separaten Menü, das sich bei Klick auf einen Knoten öffnet
- [?] Unterscheidung Sources und Sinks (FG)

- Alle Style und Layout Operationen werden in einem separatem Controller gebündelt

## Verbesserung von Aussehen Dbl-click connected:
- Mithilfe von Gradient, bessere Bestimmung der Entfernung
- WIE?
	- connected = array von predecessors und successors -> Reihenfolge nach nach fern
	- für Jedes Element eine zahl ++ iteriert und als weight im der node-data gespeichert
	- Danach mit dataMapper(weight, 0, 100, dark-color, light-color), gemappt
	- 📷 Beispielbild
		- ![[GraphIT-connected-redo.png]]
	- Zusätzliche Umrandung für noch bessere Unterscheidung zum Rest vom Graphen
- VERBESSERUNG
	- mithilfe von depthfirstsearch in node/edge.data() die depths als weight gespeichert
		- 📷 
			- ![[GraphIT-style-connected2 1.png]]
	- Nicht alle direkten Neighbors werden auch als direkte Neighbors gefunden
		- 📷 -> Shading Basics hat direkte Neighbors Radiosity, Ray Tracing, Grouraud Shading, Wikipedia: Shading, GLSL Vertex Shaders, Flat Shading, Font Shading
		- Aber Nur Radiosity, Ray Tracing, Wikipedia Shading werden richtig gestylt
			- ![[GraphIT-connecte-color-problem.png]]
	- FIX: breadthFirstSearch anstadt depthFirstSearch
		- 📷 
			- ![[GraphIT-connecte-color-problem-fix.png]]
- Verbesserung mit Layout -> siehe: [[Entwicklung#2.c showConnected() - Layout]]
	- [c] Layout wird sehr unübersichtlich
- Probleme mit hover
	- Der connected Style überschreibt den hover-style bei Nodes und Knoten-Pfeilspitzen
	- 📷
		- ![[GraphIT-connected-hover-styleing-issues.png]]
	- FIX: Styles haben Priorität, je nach Reihenfolge
		- [Source](https://github.com/cytoscape/cytoscape.js/issues/691), 2.Kommentar
		- 📷 
			- ![[GraphIT-connected-hover-fixed.png]]
		- Auch Sichtbar hier -> visueller Glitch:
			- Wenn man vom ganzen Graph direkt auf einen Knoten dbl-klickt werden manche edge-end-points wie bei hover gestylt
			- Nicht, wenn man erst den Kurs dbl-klickt
- Rest des Graphen
	- Anzeige von wichtigen Nodes für eine besser Orientierung
	- Wirkt, vor allem mit ghost-edges sehr überfüllt
	- [?] Verbesserung mithilfe von größerer Opacity auf den geghosteten Edges
		- 📷 
			- ![[GraphIT-ghost-edges2.png]]
	- [?] Restliche Nodes -> hier auch eine Style-Veränderung ??
- [!] Verbesserung des Stylings generell 
	- nach kurzen, formlosen Feedback (Mama) -> Farbe hilft dabei die Knoten miteinander zu Verbinden
	- [x] Connected muss sich mehr vom restlichen Graphen abheben/unterscheiden
	- [?] Leichte Farbe reinbringen
		- [-] evtl. wieder Grün 🟢
		- [x] Lila 🟣-> sticht nicht zu sehr raus + nah an Grau
		- 📷 
			-  ![[GraphIT-connecte-colors.png]]

## Kleines Feedback
- Problem mit den Labels 
	- Knoten überhaupt notwendig?
	- [x] Label als Knoten darstellen
- [x] Neighbors/Connected mit Gradient 
	- [x] dblclick zeigt alle neighbors/connected mit einem Gradient an
- [x] Ghost edges anstatt hide


# 2.b Abstraktion
## Cluster: ???
- Frage nach Umsetzung
- Einfachste Möglichkeit mit Parents für "contextuelle" Cluster
	- gute Idee, laut Studien
	- ABER: Problem mit großen Flächen im Layout
	- siehe [[Entwicklung#Probleme mit Layouts - *fCoSE*]]
	- [!] Umsetzung ohne visuelle Parent -> weil in cy nur Rechtecke, sondern mit BubbleSets-Extension
		- [?] WIE: Markierung (Farben werden in Lit genutzt, wird hier zuviel, denke ich)
		- [I] Nur Anzeige, bei Hover 
			- [ ] Underlay, zeigt an, welche Knoten in der gleichen Category sind
			- [ ] Ist das Verständlich ?
	- [I] CiSE
- Strukturelle Cluster
	- clustering mithilfe von degree()
	- CiSE
		- using markovClusters() -> hält komplett die Seite an ❌ 
		- [ ] Testen mit parents
			- [?] Macht das überhaupt Sinn -> es werden ja nicht alle Nodes in einem Cluster dann dargestellt
			- parent-spacing in *fCoSE* ist schwierig (siehe [[Entwicklung#Probleme mit Layouts - *fCoSE*]])
	- markovClustering() -> returns array with collections
		- run layout on collections?
		- Im ganzen Graphen, wird Performance sehr schlecht, und schaut sowieso schlecht aus 
		- 📷 
			- ![[GraphIT-markovCluster.png]]
		- Im Kurs, bessere Performance + interessantes Layout -> HILFREICH?
		- 📷 
			- ![[GraphIT-markovCluster-course.png]]
		- Für showConnected() unbrauchbar
			- Layout verändert sich zu stark
			- Layout ist nicht viel besser
			- 📷 
				- ![[GraphIT-markovCluster-connected.png]]
- Ansatz: bei dbl-click, wenn die connected Nodes angezeigt werden, wird der Graph neu ausgelegt
	- [?] Hier ansetzen ??
- [?] Separate Layout benutzen
	- Performance?

- [x] Ghosting
	- Weglassen von möglichst vielen Informationen, ohne dass die Graph-Struktur verloren geht
	- [?] Edges komplett verstecken oder auch ghosten
		- Anzeige Pfeilspitzen (wird nur unübersichtlich, wenn die Pfeile zu hell sind)
			- 📷 Beispielbild
			- ![[GraphIT-ghost edges.png]]
			- ![[GraphIT-ghost edges 1.png]]
			- ![[GraphIT-ghost edge 3.png]]
	- [!] Besseres Clustering v.a. im kompletten Graphen 

## Labels (siehe Feedback)
- sind die Knoten selber überhaupt notwendig um den Graphen lesen zu können
- Labels sind notwendig um den Graphen zu verstehen
	- Lerninhalte müssen lesbar sein
- [i] Gute Idee, aber Umsetzung könnte schwierig werden
- Edges zeigen auf Knoten, nicht auf Label
	- sind also entweder unter dem Label oder über dem Label
		- 📷 Beispielbild
			- ![[GraphIT-labelStyle.png]]
- Node Size müsste genau auf den Text angepasst sein, bzw. andersrum
	- [?] Wie 
		- `widht: 'label'` -> siehe [1.Antwort](https://github.com/cytoscape/cytoscape.js/issues/1242) 

## Globale + Lokale Ansicht
- Kurs vs. ganzer Graph
- Ganzer Graph = globale Ansicht:
	- [x] Wichtige Knoten hervorheben, unterscheiden
		- Hervorhebung durch Größe (FG)
		- Definierung Größe mithilfe von degree(), siehe DigiFit4All
		- Farben werden eher für andere Dinge verwendet
		- [?] Bessere Definition -> in Studie abfragen
		- [?] Mithilfe von Linienstärke unterstreichen
	- [?] Verbesserung 
- Kurs-Ansicht
	- Abstraktion des Graphens
	- Ansonsten funktioniert Ähnlich
- [?] Verbindung der beiden über Hotlist 
### Fokus+Context
- [ ] Cluster (siehe [[Entwicklung#2.b Cluster und Abstraktion]])
- showConnected() -> dbl-click()
	- [x] TODO: center dbl-clicked node
	- Gradient hilft mit Fokus auf (nächste) Nachbarn
		- Unterstützung mit Gradient auf Edges
		- Gradient erstellt durch depthFirstSearch() und depths als weights
	- [I] Restliche Graph wird mit weniger Detail angezeigt
		- siehe [[Entwicklung#Verbesserung von Aussehen Dbl-click connected]] 
	- [?] Änderung des Layouts, sodass die relevanten Knoten in der Nähe sind
		- siehe: Fisheye lense, cgv: fisheye lense

## Hotlist
- [ ] Tree-View
	- siehe cytoscape, cgv?
	- Unterstützt die Visualisierung der Hierarchie
- [ ] On enterCourse/leaveCourse() soll sie sich entfalten, um die Kursknoten mit anzuzeigen
	- Abstraktion, wie im Graphen
	- Synchronization mit dem Graphen
```
Kurs 1
Kurs 2
	Konten 1
	Knoten 2
	Knoten 3
	...
Kurs 3
```


# 2.c showConnected() - Layout
- Aktuell:
	- connected = alle predecessors und successors
	- Layout wird nur auf connected angewendet, damit sich nicht der ganze Graph wieder neu auslegt
		- die Mentale Map wird nicht verändert
		- Die Knoten bleiben auf ähnlichen Stellen
		- Das layout wird sonst sehr weit -> weil incremental
			- 📷 
				- ![[GraphIT-layout2-fcose-course-all.png]]
	- 📷 (1 = vor connected | 2 = nach connected)
		- ![[GraphIT-con-lay-1.png]]
		- ![[GraphIT-con-lay-2.png]]
- Verbesserung ?
	- Idee von Cluster und Expand anwenden
	- Fisheye (ähnlich Cluster)
		- Option hierfür existiert in expand-collapse extension
	- [?] Bg & Fg
	- [?] layout utilites -> placeHiddenNodes() -> hilft das beim layout?
		- erster Test Nein -> ähnlich gemacht, wie demo
- Funktionalität
	- bei dbl-click, sollen alle connected Nodes (zuvor geghosted) übersichtlich angezeigt werden
	- Alle sichtbaren, bereits Platzierten nodes sollte sich möglichst nicht bewegen
		- evtl: `nodes.lock() / nodes.unlock()`
	- Alle neu erscheinenden Nodes sollten das Layout nicht zu sehr verändern, aber trotzdem gut sichtbar sein
	- connected Nodes sollten sich möglichst clustern
	- [i] Expand layout for connected mithilfe von expand-collapse extension
		- 📷 
			- mit Graph Layout![[GraphIT-expand-collapse-1.png]]
			- mit course Layout ![[GraphIT-expand-collapse-2.png]]
		  - macht irgendwas komisches beim layouten -> vermutlich, weil Knoten nicht direkt collapsed sind
- [i] Beste Option bis jetzt immer noch:
	- separates inkrementelles Layout auf den connected Nodes laufen lassen
		- 📷 
			- ![[GraphIT-con-lay-3.png]]
	- Rest der Nodes mit normalem Graph layout laufen lassen
		- Restliche Knoten gehen  *sehr* weit weg
			- 📷 
				- ![[GraphIT-con-lay-4.png]]
	- [?] Evtl. restliche Knoten mit anderen weniger gespacetem Layout laufen lassen
- Erneuter Versuch mit expand-collapse
	- Besser
	- Weniger visuelle ruckel
		- 📷 
			- ![[GraphIT-expand-collapse-3.png]]
	- weiß zwar nicht genau, was ich geändert habe, aber ...

# 3. Layout

- [I] Separates Layout für sichtbare und geghostete Knoten
	- Sichtbar -> weiter auseinander
	- Geghostet 
		- kleinere Abstände
		- Nähe zu sichtbarem Neighbour

Umsetzung:
- Layout: *fCoSe* solang nicht explizit genannt
- Mithilfe von Styling Layout verändern
	- wenn Knoten/Edges ein ghost-Style haben, sollen sie sich weniger abstoßen und kürzere Edges haben
		- hat nicht wirklich was verändert
		- 📷 
- Anwendung zuerst auf sichtbare Knoten, danach auf die Ghosts, um sie um die Knoten anzusammeln
	- Versuch mit markov-clustering ❌ -> grottige Performance, siehe oben
	- Mit Styling + nur auf sichtbare Knoten 
		- Note: cola gibt eig. das gleiche
		- 📷 
			- ![[GraphIT-layout2-fcose-cond+noGhost.png]]
	- Bester Versuch: v.a. durch minimierung der angezeigten Knoten
		- 📷 
			- ![[GraphIT-layout2-fcose-2.png]]
			- ![[GraphIT-layout2-fcose-2-2.png]]
- [i] Problem: jede Einstellung muss gefühlt für alle Möglichkeiten der anderen Einstellungen ausprobiert werden
```ts
const setRepulsion = (node:cytoscape.NodeSingular) => {
    if(node.hasClass("ghost")) {
        return 0;
    } else if (node.hasClass("course")) {
        return 50000;
    } else {
        const degree = node.degree(false);
        //console.log(degree);
        return degree * 100;
    }
    //return node.hasClass("ghost") ? 50 : 100000;
}

const setLength = (edge:cytoscape.EdgeSingular) => {
    if(edge.hasClass("ghost-edges")) {
        return 0;
    } else {
        //Longer edge for bigger degree
        const degree = edge.target().degree(false);
        console.log(degree);
        return degree < 25 ? 2 : degree * 5 ;
        //return degree < edge.target().maxDegree(false) ? 5 : degree  * 5;
    }
    //return edge.hasClass("ghost-edges") ? 1 : 100;
}
```

- [I] Zwei separate Layouts auf zwei Ebenen
	- richtige Separierung der Elemente, damit die Layouts komplett unabhängig laufen können

- Spread (ohne alles)
	- 📷 
		- ![[GraphIT-layout2-spread.png]]
- Cola (ohne Constraints/Styling, etc.) -> nur constraint of edgeLength -> siehe styleing
	- 📷
		- ![[GraphIT-layout2-cola.png]]

- gleiches Laoyut im Kurs benutzen:
	- 📷 
		- ![[GraphIT-course-layout.png]]
	- evtl. nochmal separates Layout
		- das wären dann 3
			- 1 full graph, 1 connected, 1 course

# Interaktion

- Pan+Zoom
	- nativ in cytoscape unterstützt
	- + siehe Entscheidung dblclick
- Select - *Auswahl sollte hervorgehoben werden*
	- nativ in cytoscape wird der Knoten auf Klick blau eingefärbt
	- [?] Farbe anpassen
	- [?] Weitere Funktionalität
	- Hover -> zeigt direkte Nachbarn an
		- Verbesserung: ghosted Edges werden mit einer geringeren Opacity angezeigt
		- 📷 Beispielbild
			- ![[GraphIT-ghost edge 3 1.png]]
	- Hotlist (FG)
	- [?] Roter Faden (FG)
		- Weiß nicht, wie ich das definieren soll
	- dbl-click
- Explore - Subset der Daten
	- siehe Abstraktion
	- Studiengang vs Kurs Ansicht
		- [!] Einfacher & schneller Wechsel zwischen beidem
		- [?] Möglichkeit im Kurs den Studiengang-Kontext anzuschauen
	- Hotlist für leichten Zugang (FG)
- Filter *nur wenn Zeit ist*
	- [ ] Einfache Search-Bar
	- Ansonsten zu viel Arbeit, was nicht für Visualisierung gebraucht wird


# Node-View ?

- Anzeige von zusätzlichen Infos im Graphen
- Hier Anzeige von Material?



# Probleme und Bugs

- [x] Edges haben irgendwie opacity, obwohl die auf 1 ist
	- opacity von nodes wurde übernommen
	- [?] Issue in github schreiben ?
	- [ ] ADJUST styles


# Evaluation
- Was bedeutet Node-Size für Studierende
	- Anfangsfrage