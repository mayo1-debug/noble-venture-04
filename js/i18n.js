// All user-facing strings, keyed by id, in en, de, fr and es. Plain JS, no dependency.
// Not translated on purpose: analytics event names, PayPal config. Legal pages exist as terms.de.html etc.; {refund}, {imprint}, {terms}, {privacy} give the page in the current language.
// Placeholders: {name} is replaced by t(key, {name: ...}). {price} is filled from config.js.
(function () {
  'use strict';
  var LANGS = ['en', 'de', 'fr', 'es'];
  var KEY = 'fc_lang';
  var cfg = window.NOBLE_CONFIG || {};

  var SUP = '<span class="support"></span>';
  var A_CC = '<a href="https://github.com/makebead/craft-color-codes" target="_blank" rel="noopener">craft-color-codes</a>';
  var A_BY = '<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>';
  var A_REF = '<a href="{refund}">refund policy</a>';
  var A_IMP = '<a href="{imprint}" target="_blank">imprint</a>';

  var D = {
    // ---- Page head ----
    'meta.title': {
      en: 'FlossChart: turn a photo into a cross-stitch pattern',
      de: 'FlossChart: aus einem Foto eine Kreuzstich-Stickvorlage machen',
      fr: 'FlossChart: transformez une photo en grille de point de croix',
      es: 'FlossChart: convierte una foto en un patrón de punto de cruz'
    },
    'meta.desc': {
      en: 'Turn any photo into a cross-stitch pattern with DMC floss colors, symbols, a floss list and skein estimates. Runs in your browser. Your photo never leaves your device.',
      de: 'Mach aus jedem Foto eine Kreuzstich-Stickvorlage mit DMC-Garnfarben, Symbolen, Garnliste und Strangschätzung. Läuft im Browser. Dein Foto verlässt nie dein Gerät.',
      fr: 'Transformez n\'importe quelle photo en grille de point de croix avec couleurs de fils DMC, symboles, liste des fils et estimation des écheveaux. Fonctionne dans votre navigateur. Votre photo ne quitte jamais votre appareil.',
      es: 'Convierte cualquier foto en un patrón de punto de cruz con colores de hilo DMC, símbolos, lista de hilos y estimación de madejas. Funciona en tu navegador. Tu foto nunca sale de tu dispositivo.'
    },

    // ---- Header ----
    'lang.label': { en: 'Language', de: 'Sprache', fr: 'Langue', es: 'Idioma' },
    'nav.how': { en: 'How it works', de: 'So geht\'s', fr: 'Comment ça marche', es: 'Cómo funciona' },
    'nav.pricing': { en: 'Pricing', de: 'Preis', fr: 'Tarif', es: 'Precio' },
    'nav.faq': { en: 'FAQ', de: 'FAQ', fr: 'FAQ', es: 'FAQ' },
    'testmode': {
      en: 'Test mode: payments use the PayPal sandbox. No real money is charged.',
      de: 'Testmodus: Zahlungen laufen über die PayPal-Sandbox. Es wird kein echtes Geld abgebucht.',
      fr: 'Mode test: les paiements passent par le bac à sable PayPal. Aucun argent réel n\'est débité.',
      es: 'Modo de prueba: los pagos usan el entorno de pruebas de PayPal. No se cobra dinero real.'
    },

    // ---- Hero ----
    'hero.h1': {
      en: 'Turn any photo into a cross-stitch pattern',
      de: 'Aus jedem Foto eine Kreuzstich-Stickvorlage',
      fr: 'Transformez n\'importe quelle photo en grille de point de croix',
      es: 'Convierte cualquier foto en un patrón de punto de cruz'
    },
    'hero.lead': {
      en: 'Upload a photo, pick the size and how many DMC colors you want. Get a clean, printable chart with symbols, a floss list and skein estimates.',
      de: 'Foto hochladen, Größe und Anzahl der DMC-Farben wählen. Du bekommst eine saubere, druckbare Stickvorlage mit Symbolen, Garnliste und Strangschätzung.',
      fr: 'Importez une photo, choisissez la taille et le nombre de couleurs DMC. Vous obtenez une grille propre et imprimable avec symboles, liste des fils et estimation des écheveaux.',
      es: 'Sube una foto y elige el tamaño y cuántos colores DMC quieres. Obtienes un patrón limpio e imprimible con símbolos, lista de hilos y estimación de madejas.'
    },
    'hero.t1': {
      en: 'Runs in your browser. <strong>Your photo never leaves your device.</strong>',
      de: 'Läuft im Browser. <strong>Dein Foto verlässt nie dein Gerät.</strong>',
      fr: 'Fonctionne dans votre navigateur. <strong>Votre photo ne quitte jamais votre appareil.</strong>',
      es: 'Funciona en tu navegador. <strong>Tu foto nunca sale de tu dispositivo.</strong>'
    },
    'hero.t2': {
      en: 'Fewer stray single stitches ("confetti") with one click.',
      de: 'Weniger einzelne Stiche ("Konfetti") mit einem Klick.',
      fr: 'Moins de points isolés ("confettis") en un clic.',
      es: 'Menos puntos sueltos ("confeti") con un clic.'
    },
    'hero.t3': {
      en: 'Charts up to 500 x 500 stitches. Free preview, free charts up to 40 x 40. Bigger charts: <strong>{price} once</strong>, no subscription.',
      de: 'Vorlagen bis 500 x 500 Stiche. Vorschau gratis, Vorlagen bis 40 x 40 gratis. Größere Vorlagen: <strong>einmalig {price}</strong>, kein Abo.',
      fr: 'Grilles jusqu\'à 500 x 500 points. Aperçu gratuit, grilles gratuites jusqu\'à 40 x 40. Grilles plus grandes: <strong>{price} une seule fois</strong>, sans abonnement.',
      es: 'Patrones de hasta 500 x 500 puntos. Vista previa gratis y patrones gratis hasta 40 x 40. Patrones más grandes: <strong>{price} una sola vez</strong>, sin suscripción.'
    },
    'hero.upload': { en: 'Upload a photo', de: 'Foto hochladen', fr: 'Importer une photo', es: 'Subir una foto' },
    'hero.sample': { en: 'Try a sample picture', de: 'Beispielbild ausprobieren', fr: 'Essayer une image d\'exemple', es: 'Probar una imagen de ejemplo' },
    'sample.pd': { en: 'public domain', de: 'gemeinfrei', fr: 'domaine public', es: 'dominio público' },
    'sample.own': { en: 'Sample picture drawn by FlossChart', de: 'Beispielbild, gezeichnet von FlossChart', fr: 'Image d\'exemple dessinée par FlossChart', es: 'Imagen de ejemplo dibujada por FlossChart' },
    'sample.next': { en: 'Try another sample', de: 'Nächstes Beispiel', fr: 'Autre exemple', es: 'Otro ejemplo' },
    'drop.text': {
      en: 'Drop a photo here, or use the button above. JPG, PNG, WebP.',
      de: 'Foto hierher ziehen oder den Button oben nutzen. JPG, PNG, WebP.',
      fr: 'Déposez une photo ici ou utilisez le bouton ci-dessus. JPG, PNG, WebP.',
      es: 'Suelta una foto aquí o usa el botón de arriba. JPG, PNG, WebP.'
    },

    // ---- Controls ----
    'ctl.width': { en: 'Width in stitches', de: 'Breite in Stichen', fr: 'Largeur en points', es: 'Ancho en puntos' },
    'ctl.colors': { en: 'Number of colors', de: 'Anzahl der Farben', fr: 'Nombre de couleurs', es: 'Número de colores' },
    'ctl.cleanup': { en: 'Confetti cleanup', de: 'Einzelstiche bereinigen (Konfetti)', fr: 'Nettoyage des confettis', es: 'Limpieza de confeti' },
    'cleanup.off': { en: 'Off', de: 'Aus', fr: 'Désactivé', es: 'Desactivada' },
    'cleanup.normal': { en: 'Normal', de: 'Normal', fr: 'Normal', es: 'Normal' },
    'cleanup.strong': {
      en: 'Strong (also merges rare colors)',
      de: 'Stark (fasst auch seltene Farben zusammen)',
      fr: 'Fort (fusionne aussi les couleurs rares)',
      es: 'Fuerte (también une los colores poco usados)'
    },
    'ctl.fabric': { en: 'Fabric (Aida count)', de: 'Stoff (Aida, Count)', fr: 'Toile (Aida, count)', es: 'Tela (Aida, count)' },
    'ctl.style': { en: 'Printed chart style', de: 'Stil der gedruckten Vorlage', fr: 'Style de la grille imprimée', es: 'Estilo del patrón impreso' },
    'style.color': {
      en: 'Color blocks + symbols',
      de: 'Farbfelder + Symbole',
      fr: 'Cases en couleur + symboles',
      es: 'Casillas de color + símbolos'
    },
    'style.bw': {
      en: 'Black and white symbols (saves ink)',
      de: 'Schwarz-weiße Symbole (spart Tinte)',
      fr: 'Symboles noir et blanc (économise l\'encre)',
      es: 'Símbolos en blanco y negro (ahorra tinta)'
    },
    'ctl.symbols': {
      en: 'Show symbols in preview',
      de: 'Symbole in der Vorschau zeigen',
      fr: 'Afficher les symboles dans l\'aperçu',
      es: 'Mostrar símbolos en la vista previa'
    },
    'preview.region': {
      en: 'Pattern preview, scrollable',
      de: 'Vorschau der Stickvorlage, scrollbar',
      fr: 'Aperçu de la grille, défilable',
      es: 'Vista previa del patrón, desplazable'
    },
    'preview.alt': {
      en: 'Cross-stitch pattern preview',
      de: 'Vorschau der Kreuzstich-Stickvorlage',
      fr: 'Aperçu de la grille de point de croix',
      es: 'Vista previa del patrón de punto de cruz'
    },
    'floss.region': {
      en: 'Floss list, scrollable',
      de: 'Garnliste, scrollbar',
      fr: 'Liste des fils, défilable',
      es: 'Lista de hilos, desplazable'
    },

    // ---- Result ----
    'btn.print': { en: 'Print chart', de: 'Vorlage drucken', fr: 'Imprimer la grille', es: 'Imprimir el patrón' },
    'btn.pdf': { en: 'Download PDF', de: 'PDF herunterladen', fr: 'Télécharger le PDF', es: 'Descargar PDF' },
    'price': { en: '{price}', de: '{price}', fr: '{price}', es: '{price}' },
    'btn.buy': {
      en: 'Unlock all sizes, {price}',
      de: 'Alle Größen freischalten, {price}',
      fr: 'Débloquer toutes les tailles, {price}',
      es: 'Desbloquear todos los tamaños, {price}'
    },
    'unlocked': {
      en: 'Full unlock active in this browser.',
      de: 'Volle Freischaltung in diesem Browser aktiv.',
      fr: 'Déblocage complet actif dans ce navigateur.',
      es: 'Desbloqueo completo activo en este navegador.'
    },
    'gate.free': {
      en: 'This chart is {max} x {max} stitches or smaller, so printing is free.',
      de: 'Diese Vorlage hat höchstens {max} x {max} Stiche, deshalb ist das Drucken gratis.',
      fr: 'Cette grille fait {max} x {max} points ou moins, l\'impression est donc gratuite.',
      es: 'Este patrón tiene {max} x {max} puntos o menos, así que imprimirlo es gratis.'
    },
    'gate.paid': {
      en: 'Charts bigger than {max} x {max} stitches need the full unlock ({price} once). The preview and floss list stay free.',
      de: 'Vorlagen über {max} x {max} Stiche brauchen die volle Freischaltung (einmalig {price}). Vorschau und Garnliste bleiben gratis.',
      fr: 'Les grilles de plus de {max} x {max} points demandent le déblocage complet ({price} une seule fois). L\'aperçu et la liste des fils restent gratuits.',
      es: 'Los patrones de más de {max} x {max} puntos necesitan el desbloqueo completo ({price} una sola vez). La vista previa y la lista de hilos siguen siendo gratis.'
    },
    'stats': {
      en: '{w} x {h} stitches · {n} DMC colors · {s} stitches · {c} lone stitches (confetti) · finished on {f} count: {a} x {b} in ({a2} x {b2} cm)',
      de: '{w} x {h} Stiche · {n} DMC-Farben · {s} Stiche · {c} einzelne Stiche (Konfetti) · fertig auf {f} count: {a} x {b} Zoll ({a2} x {b2} cm)',
      fr: '{w} x {h} points · {n} couleurs DMC · {s} points · {c} points isolés (confettis) · terminé sur toile {f} count: {a} x {b} po ({a2} x {b2} cm)',
      es: '{w} x {h} puntos · {n} colores DMC · {s} puntos · {c} puntos sueltos (confeti) · terminado en Aida de {f} count: {a} x {b} pulg. ({a2} x {b2} cm)'
    },
    'floss.h': { en: 'Floss list (DMC)', de: 'Garnliste (DMC)', fr: 'Liste des fils (DMC)', es: 'Lista de hilos (DMC)' },
    'floss.note': {
      en: 'Screen colors are approximate. Thread looks different in real light. Skeins: estimate for 2 strands, about 1.800 full stitches per skein on 14 count, waste included.',
      de: 'Bildschirmfarben sind nur ungefähr. Garn sieht im echten Licht anders aus. Stränge: Schätzung für 2 Fäden, etwa 1.800 volle Stiche pro Strang bei 14 count, Verschnitt eingerechnet.',
      fr: 'Les couleurs à l\'écran sont approximatives. Le fil paraît différent à la lumière réelle. Écheveaux: estimation pour 2 brins, environ 1.800 points entiers par écheveau en 14 count, chutes comprises.',
      es: 'Los colores en pantalla son aproximados. El hilo se ve distinto con luz real. Madejas: estimación para 2 hebras, unos 1.800 puntos completos por madeja en 14 count, desperdicio incluido.'
    },
    'tbl.sym': { en: 'Symbol', de: 'Symbol', fr: 'Symbole', es: 'Símbolo' },
    'tbl.sym.short': { en: 'Sym', de: 'Sym.', fr: 'Sym.', es: 'Símb.' },
    'tbl.color': { en: 'Color', de: 'Farbe', fr: 'Couleur', es: 'Color' },
    'tbl.name': { en: 'Name', de: 'Name', fr: 'Nom', es: 'Nombre' },
    'tbl.stitches': { en: 'Stitches', de: 'Stiche', fr: 'Points', es: 'Puntos' },
    'tbl.skeins': { en: 'Skeins', de: 'Stränge', fr: 'Écheveaux', es: 'Madejas' },
    'tbl.skeinsf': { en: 'Skeins ({f} ct)', de: 'Stränge ({f} ct)', fr: 'Écheveaux ({f} ct)', es: 'Madejas ({f} ct)' },

    // ---- How it works ----
    'how.h': { en: 'How it works', de: 'So geht\'s', fr: 'Comment ça marche', es: 'Cómo funciona' },
    'how.1': {
      en: '<strong>Upload.</strong> Pick a photo of your pet, a wedding picture, a logo or pixel art.',
      de: '<strong>Hochladen.</strong> Wähle ein Foto von deinem Haustier, ein Hochzeitsbild, ein Logo oder Pixelart.',
      fr: '<strong>Importez.</strong> Choisissez une photo de votre animal, une photo de mariage, un logo ou du pixel art.',
      es: '<strong>Sube.</strong> Elige una foto de tu mascota, una foto de boda, un logotipo o pixel art.'
    },
    'how.2': {
      en: '<strong>Adjust.</strong> Set the width in stitches and the number of colors. The preview, finished size and floss list update right away.',
      de: '<strong>Anpassen.</strong> Stelle die Breite in Stichen und die Anzahl der Farben ein. Vorschau, fertige Größe und Garnliste ändern sich sofort.',
      fr: '<strong>Ajustez.</strong> Réglez la largeur en points et le nombre de couleurs. L\'aperçu, la taille finale et la liste des fils se mettent à jour tout de suite.',
      es: '<strong>Ajusta.</strong> Fija el ancho en puntos y el número de colores. La vista previa, el tamaño final y la lista de hilos se actualizan al instante.'
    },
    'how.3': {
      en: '<strong>Print.</strong> Print the chart or save it as a PDF from the print window: a cover page with the floss list and sizes, then grid pages with symbols, bold lines every 10 stitches and row numbers.',
      de: '<strong>Drucken.</strong> Drucke die Vorlage oder speichere sie im Druckfenster als PDF: eine Titelseite mit Garnliste und Größen, danach Rasterseiten mit Symbolen, fetten Linien alle 10 Stiche und Zeilennummern.',
      fr: '<strong>Imprimez.</strong> Imprimez la grille ou enregistrez-la en PDF depuis la fenêtre d\'impression: une page de garde avec la liste des fils et les tailles, puis des pages de grille avec symboles, traits épais tous les 10 points et numéros de rangs.',
      es: '<strong>Imprime.</strong> Imprime el patrón o guárdalo como PDF desde la ventana de impresión: una portada con la lista de hilos y los tamaños, y después páginas de cuadrícula con símbolos, líneas gruesas cada 10 puntos y números de fila.'
    },

    // ---- Videos ----
    'vid.h': {
      en: 'Watch before you choose your settings',
      de: 'Schau vor dem Einstellen kurz rein',
      fr: 'À voir avant de choisir vos réglages',
      es: 'Míralo antes de elegir tus ajustes'
    },
    'vid.lead': {
      en: 'Ten short videos, grouped by what you want to do. The videos are in English with on-screen text.',
      de: 'Zehn kurze Videos, sortiert nach dem, was du vorhast. Die Videos sind auf Englisch, mit Text im Bild.',
      fr: 'Dix courtes vidéos, classées selon ce que vous voulez faire. Les vidéos sont en anglais, avec du texte à l\'écran.',
      es: 'Diez vídeos cortos, ordenados según lo que quieras hacer. Los vídeos están en inglés, con texto en pantalla.'
    },
    'vid.note': {
      en: 'A video loads from YouTube (privacy-enhanced mode) only after you press play. Until then nothing is sent to YouTube. See the <a href="{privacy}">privacy policy</a>.',
      de: 'Ein Video wird erst von YouTube geladen (erweiterter Datenschutzmodus), wenn du auf Abspielen drückst. Vorher wird nichts an YouTube gesendet. Siehe <a href="{privacy}">Datenschutz</a>.',
      fr: 'Une vidéo n\'est chargée depuis YouTube (mode confidentialité renforcée) qu\'après avoir appuyé sur lecture. Avant, rien n\'est envoyé à YouTube. Voir la <a href="{privacy}">politique de confidentialité</a>.',
      es: 'Un vídeo se carga desde YouTube (modo de privacidad mejorada) solo después de pulsar reproducir. Hasta entonces no se envía nada a YouTube. Consulta la <a href="{privacy}">política de privacidad</a>.'
    },
    'vid.watch': {
      en: 'Watch: how this works',
      de: 'Video: so funktioniert das',
      fr: 'Vidéo: comment ça marche',
      es: 'Vídeo: cómo funciona'
    },
    'v.10': {
      en: 'Three choices before you print',
      de: 'Drei Entscheidungen vor dem Drucken',
      fr: 'Trois choix avant d\'imprimer',
      es: 'Tres decisiones antes de imprimir'
    },
    'v.03': {
      en: 'How big are 100 stitches on 14 vs 18 count?',
      de: 'Wie groß sind 100 Stiche auf 14 vs 18 count?',
      fr: 'Quelle taille font 100 points en 14 ou 18 count?',
      es: '¿Cuánto miden 100 puntos en 14 o 18 count?'
    },
    'v.04': {
      en: '8 or 24 colors?',
      de: '8 oder 24 Farben?',
      fr: '8 ou 24 couleurs?',
      es: '¿8 o 24 colores?'
    },
    'v.01': {
      en: 'What confetti cleanup changes',
      de: 'Was die Konfetti-Bereinigung ändert',
      fr: 'Ce que change le nettoyage des confettis',
      es: 'Qué cambia la limpieza de confeti'
    },
    'v.06': {
      en: 'How to read the symbols',
      de: 'So liest du die Symbole',
      fr: 'Comment lire les symboles',
      es: 'Cómo leer los símbolos'
    },
    'v.05': {
      en: 'The DMC floss list',
      de: 'Die DMC-Garnliste',
      fr: 'La liste des fils DMC',
      es: 'La lista de hilos DMC'
    },
    'v.09': {
      en: 'What is inside the PDF',
      de: 'Was im PDF steckt',
      fr: 'Ce que contient le PDF',
      es: 'Qué hay dentro del PDF'
    },
    'v.02': {
      en: 'A free 40 × 40 chart',
      de: 'Eine kostenlose 40 × 40 Vorlage',
      fr: 'Une grille 40 × 40 gratuite',
      es: 'Un patrón gratis de 40 × 40'
    },
    'v.07': {
      en: 'Is my photo uploaded?',
      de: 'Wird mein Foto hochgeladen?',
      fr: 'Ma photo est-elle envoyée?',
      es: '¿Se sube mi foto?'
    },
    'v.08': {
      en: 'Pet photo to pattern',
      de: 'Vom Haustierfoto zur Vorlage',
      fr: 'De la photo d\'animal à la grille',
      es: 'De la foto de mascota al patrón'
    },

    // ---- Videos: groups ----
    'g.settings': { en: 'Choosing your settings', de: 'Einstellungen wählen', fr: 'Choisir vos réglages', es: 'Elegir tus ajustes' },
    'g.print': { en: 'Reading and printing your chart', de: 'Vorlage lesen und drucken', fr: 'Lire et imprimer votre grille', es: 'Leer e imprimir tu patrón' },
    'g.start': { en: 'Before you start', de: 'Bevor du loslegst', fr: 'Avant de commencer', es: 'Antes de empezar' },
    'vid.prev': { en: 'Previous videos', de: 'Vorherige Videos', fr: 'Vidéos précédentes', es: 'Vídeos anteriores' },
    'vid.next': { en: 'Next videos', de: 'Nächste Videos', fr: 'Vidéos suivantes', es: 'Siguientes vídeos' },

    // ---- Videos: one-line descriptions ----
    'd.10': {
      en: 'Width, number of colors and confetti cleanup: the three choices that shape your chart.',
      de: 'Breite, Farbanzahl und Konfetti-Bereinigung: die drei Entscheidungen, die deine Vorlage formen.',
      fr: 'Largeur, nombre de couleurs et nettoyage des confettis: les trois choix qui façonnent votre grille.',
      es: 'Ancho, número de colores y limpieza de confeti: las tres decisiones que dan forma a tu patrón.'
    },
    'd.03': {
      en: 'The same 100 stitches measure 18.1 cm on 14 count and 14.1 cm on 18 count.',
      de: 'Dieselben 100 Stiche messen auf 14 count 18,1 cm und auf 18 count 14,1 cm.',
      fr: 'Les mêmes 100 points mesurent 18,1 cm en 14 count et 14,1 cm en 18 count.',
      es: 'Los mismos 100 puntos miden 18,1 cm en 14 count y 14,1 cm en 18 count.'
    },
    'd.04': {
      en: 'Two previews of the same photo, 8 colors against 24.',
      de: 'Zwei Vorschauen desselben Fotos, 8 Farben gegen 24.',
      fr: 'Deux aperçus de la même photo, 8 couleurs contre 24.',
      es: 'Dos vistas previas de la misma foto, 8 colores frente a 24.'
    },
    'd.01': {
      en: 'On one cat photo: 140 lone stitches with cleanup off, none with normal cleanup.',
      de: 'Bei einem Katzenfoto: 140 einzelne Stiche ohne Bereinigung, keiner mit normaler Bereinigung.',
      fr: 'Sur une photo de chat: 140 points isolés sans nettoyage, aucun avec le nettoyage normal.',
      es: 'En una foto de gato: 140 puntos sueltos sin limpieza, ninguno con limpieza normal.'
    },
    'd.06': {
      en: 'Match a symbol in the grid to its DMC number in the key.',
      de: 'Ordne ein Symbol im Raster seiner DMC-Nummer in der Legende zu.',
      fr: 'Associez un symbole de la grille à son numéro DMC dans la légende.',
      es: 'Relaciona un símbolo de la cuadrícula con su número DMC en la leyenda.'
    },
    'd.05': {
      en: 'The PDF lists every DMC color with stitch counts and a skein estimate.',
      de: 'Das PDF listet jede DMC-Farbe mit Stichzahl und Strangschätzung.',
      fr: 'Le PDF liste chaque couleur DMC avec le nombre de points et une estimation d\'écheveaux.',
      es: 'El PDF lista cada color DMC con el número de puntos y una estimación de madejas.'
    },
    'd.09': {
      en: 'The floss key page, then the chart pages with symbols and a bold line every 10 stitches.',
      de: 'Erst die Garnliste, dann die Rasterseiten mit Symbolen und einer kräftigen Linie alle 10 Stiche.',
      fr: 'D\'abord la liste des fils, puis les pages de grille avec symboles et un trait épais tous les 10 points.',
      es: 'Primero la lista de hilos, luego las páginas del patrón con símbolos y una línea gruesa cada 10 puntos.'
    },
    'd.02': {
      en: 'One photo becomes a free 40 × 40 chart with 8 DMC colors.',
      de: 'Ein Foto wird zu einer kostenlosen 40 × 40 Vorlage mit 8 DMC-Farben.',
      fr: 'Une photo devient une grille 40 × 40 gratuite avec 8 couleurs DMC.',
      es: 'Una foto se convierte en un patrón gratis de 40 × 40 con 8 colores DMC.'
    },
    'd.07': {
      en: 'Your photo is turned into a chart in your browser. It is not uploaded.',
      de: 'Dein Foto wird in deinem Browser zur Vorlage. Es wird nicht hochgeladen.',
      fr: 'Votre photo devient une grille dans votre navigateur. Elle n\'est pas envoyée.',
      es: 'Tu foto se convierte en patrón en tu navegador. No se sube.'
    },
    'd.08': {
      en: 'A cat portrait becomes a 100 × 100 stitch preview with 14 DMC colors.',
      de: 'Ein Katzenporträt wird zur Vorschau mit 100 × 100 Stichen und 14 DMC-Farben.',
      fr: 'Un portrait de chat devient un aperçu de 100 × 100 points avec 14 couleurs DMC.',
      es: 'Un retrato de gato se convierte en una vista previa de 100 × 100 puntos con 14 colores DMC.'
    },

    // ---- Pricing ----
    'pricing.h': { en: 'Pricing', de: 'Preis', fr: 'Tarif', es: 'Precio' },
    'plan.free': { en: 'Free', de: 'Gratis', fr: 'Gratuit', es: 'Gratis' },
    'plan.free.amount': { en: '€0', de: '0 €', fr: '0 €', es: '0 €' },
    'plan.free.1': { en: 'Preview at any size', de: 'Vorschau in jeder Größe', fr: 'Aperçu à toutes les tailles', es: 'Vista previa de cualquier tamaño' },
    'plan.free.2': {
      en: 'Full DMC floss list with stitch counts and skeins',
      de: 'Komplette DMC-Garnliste mit Stichzahlen und Strängen',
      fr: 'Liste complète des fils DMC avec nombre de points et écheveaux',
      es: 'Lista completa de hilos DMC con número de puntos y madejas'
    },
    'plan.free.3': {
      en: 'Printable charts up to 40 x 40 stitches',
      de: 'Druckbare Vorlagen bis 40 x 40 Stiche',
      fr: 'Grilles imprimables jusqu\'à 40 x 40 points',
      es: 'Patrones imprimibles de hasta 40 x 40 puntos'
    },
    'plan.full': { en: 'Full unlock', de: 'Volle Freischaltung', fr: 'Déblocage complet', es: 'Desbloqueo completo' },
    'plan.full.note': {
      en: 'one-time, no VAT charged (Section 19 UStG)',
      de: 'einmalig, keine Umsatzsteuer berechnet (§ 19 UStG)',
      fr: 'paiement unique, TVA non facturée (§ 19 UStG)',
      es: 'pago único, sin IVA (§ 19 UStG)'
    },
    'plan.full.1': {
      en: 'Printable charts up to 500 x 500 stitches',
      de: 'Druckbare Vorlagen bis 500 x 500 Stiche',
      fr: 'Grilles imprimables jusqu\'à 500 x 500 points',
      es: 'Patrones imprimibles de hasta 500 x 500 puntos'
    },
    'plan.full.2': {
      en: 'Unlimited patterns in this browser',
      de: 'Unbegrenzt viele Vorlagen in diesem Browser',
      fr: 'Grilles illimitées dans ce navigateur',
      es: 'Patrones ilimitados en este navegador'
    },
    'plan.full.3': {
      en: 'No account, no subscription',
      de: 'Kein Konto, kein Abo',
      fr: 'Sans compte, sans abonnement',
      es: 'Sin cuenta, sin suscripción'
    },
    'btn.unlock': { en: 'Unlock for {price}', de: 'Freischalten für {price}', fr: 'Débloquer pour {price}', es: 'Desbloquear por {price}' },

    // ---- FAQ ----
    'faq.h': { en: 'FAQ', de: 'FAQ', fr: 'FAQ', es: 'FAQ' },
    'faq.q1': {
      en: 'Is my photo uploaded anywhere?',
      de: 'Wird mein Foto irgendwohin hochgeladen?',
      fr: 'Ma photo est-elle envoyée quelque part?',
      es: '¿Mi foto se sube a algún sitio?'
    },
    'faq.a1': {
      en: 'No. The pattern is made by code that runs in your browser. The photo is never sent to a server.',
      de: 'Nein. Die Stickvorlage wird von Code erstellt, der in deinem Browser läuft. Das Foto wird nie an einen Server gesendet.',
      fr: 'Non. La grille est créée par du code qui s\'exécute dans votre navigateur. La photo n\'est jamais envoyée à un serveur.',
      es: 'No. El patrón lo crea código que se ejecuta en tu navegador. La foto nunca se envía a un servidor.'
    },
    'faq.q2': {
      en: 'Which floss brand?',
      de: 'Welche Garnmarke?',
      fr: 'Quelle marque de fil?',
      es: '¿Qué marca de hilo?'
    },
    'faq.a2': {
      en: 'DMC six-strand cotton, matched from a table of 489 DMC colors (color data: ' + A_CC + ' by MakeBead, ' + A_BY + '). Screen colors are approximations, so check the real thread before you buy a lot of it.',
      de: 'DMC-Baumwollgarn mit sechs Fäden, zugeordnet aus einer Tabelle mit 489 DMC-Farben (Farbdaten: ' + A_CC + ' von MakeBead, ' + A_BY + '). Bildschirmfarben sind nur Näherungen. Prüfe das echte Garn, bevor du viel davon kaufst.',
      fr: 'Coton DMC à six brins, associé à partir d\'un tableau de 489 couleurs DMC (données de couleur: ' + A_CC + ' par MakeBead, ' + A_BY + '). Les couleurs à l\'écran sont des approximations: vérifiez le vrai fil avant d\'en acheter beaucoup.',
      es: 'Algodón DMC de seis hebras, elegido de una tabla de 489 colores DMC (datos de color: ' + A_CC + ' de MakeBead, ' + A_BY + '). Los colores en pantalla son aproximaciones, así que comprueba el hilo real antes de comprar mucho.'
    },
    'faq.q3': {
      en: 'How big will it be?',
      de: 'Wie groß wird das Bild?',
      fr: 'Quelle sera la taille?',
      es: '¿Qué tamaño tendrá?'
    },
    'faq.a3': {
      en: 'The tool shows the finished size for 11, 14, 16 and 18 count Aida. Example: 140 stitches wide on 14 count is 10 inches (25,4 cm).',
      de: 'Das Tool zeigt die fertige Größe für Aida mit 11, 14, 16 und 18 count. Beispiel: 140 Stiche Breite auf 14 count sind 10 Zoll (25,4 cm).',
      fr: 'L\'outil affiche la taille finale pour de la toile Aida 11, 14, 16 et 18 count. Exemple: 140 points de large en 14 count font 10 pouces (25,4 cm).',
      es: 'La herramienta muestra el tamaño final para Aida de 11, 14, 16 y 18 count. Ejemplo: 140 puntos de ancho en 14 count son 10 pulgadas (25,4 cm).'
    },
    'faq.q4': {
      en: 'What do I get when I pay?',
      de: 'Was bekomme ich, wenn ich bezahle?',
      fr: 'Que reçois-je en payant?',
      es: '¿Qué obtengo al pagar?'
    },
    'faq.a4': {
      en: 'Printing for every chart size up to 500 x 500 stitches, for as many patterns as you like, in the browser you paid in. The unlock is saved in this browser. Keep your PayPal order ID. If you clear your browser data or switch devices, contact support with the order ID.',
      de: 'Drucken in jeder Größe bis 500 x 500 Stiche, für so viele Vorlagen, wie du willst, in dem Browser, in dem du bezahlt hast. Die Freischaltung wird in diesem Browser gespeichert. Bewahre deine PayPal-Bestellnummer auf. Wenn du deine Browserdaten löschst oder das Gerät wechselst, schreib dem Support mit der Bestellnummer.',
      fr: 'L\'impression de toutes les tailles de grille jusqu\'à 500 x 500 points, pour autant de modèles que vous voulez, dans le navigateur où vous avez payé. Le déblocage est enregistré dans ce navigateur. Conservez votre numéro de commande PayPal. Si vous effacez les données du navigateur ou changez d\'appareil, contactez le support avec ce numéro.',
      es: 'Impresión de todos los tamaños hasta 500 x 500 puntos, para tantos patrones como quieras, en el navegador donde pagaste. El desbloqueo se guarda en este navegador. Guarda tu número de pedido de PayPal. Si borras los datos del navegador o cambias de dispositivo, escribe al soporte con ese número.'
    },
    'faq.q5': {
      en: 'Can I get a refund?',
      de: 'Kann ich mein Geld zurückbekommen?',
      fr: 'Puis-je être remboursé?',
      es: '¿Puedo pedir un reembolso?'
    },
    'faq.a5': {
      en: 'Yes. See the ' + A_REF + '.',
      de: 'Ja. Siehe die ' + A_REF + '.',
      fr: 'Oui. Voir la ' + A_REF + '.',
      es: 'Sí. Consulta la ' + A_REF + '.'
    },
    'faq.q6': {
      en: 'Can I use any picture?',
      de: 'Kann ich jedes Bild verwenden?',
      fr: 'Puis-je utiliser n\'importe quelle image?',
      es: '¿Puedo usar cualquier imagen?'
    },
    'faq.a6': {
      en: 'Use your own photos, or pictures you have the right to use. Charting someone else\'s artwork can break their copyright.',
      de: 'Nutze deine eigenen Fotos oder Bilder, deren Nutzung dir erlaubt ist. Wer fremde Kunstwerke in eine Stickvorlage umsetzt, kann deren Urheberrecht verletzen.',
      fr: 'Utilisez vos propres photos ou des images dont vous avez le droit de vous servir. Transformer en grille l\'œuvre de quelqu\'un d\'autre peut porter atteinte à son droit d\'auteur.',
      es: 'Usa tus propias fotos o imágenes que tengas derecho a usar. Convertir en patrón la obra de otra persona puede infringir sus derechos de autor.'
    },

    // ---- Buy window ----
    'modal.close': { en: 'Close', de: 'Schließen', fr: 'Fermer', es: 'Cerrar' },
    'm.title': {
      en: 'Unlock all chart sizes',
      de: 'Alle Vorlagengrößen freischalten',
      fr: 'Débloquer toutes les tailles de grille',
      es: 'Desbloquear todos los tamaños de patrón'
    },
    'm.intro': {
      en: '<strong>{price}</strong> once. No VAT is charged (small business under Section 19 UStG). Printable charts up to 500 x 500 stitches, unlimited patterns in this browser.',
      de: '<strong>Einmalig {price}.</strong> Es wird keine Umsatzsteuer berechnet (Kleinunternehmer nach § 19 UStG). Druckbare Vorlagen bis 500 x 500 Stiche, unbegrenzt viele Vorlagen in diesem Browser.',
      fr: '<strong>{price}</strong> une seule fois. TVA non facturée (petite entreprise selon le § 19 UStG). Grilles imprimables jusqu\'à 500 x 500 points, grilles illimitées dans ce navigateur.',
      es: '<strong>{price}</strong> una sola vez. No se cobra IVA (pequeña empresa según el § 19 UStG). Patrones imprimibles de hasta 500 x 500 puntos, patrones ilimitados en este navegador.'
    },
    'm.consent': {
      en: 'I want the unlock to start right away. I understand that I then lose the 14-day right of withdrawal for digital content. The voluntary <a href="{refund}" target="_blank">refund policy</a> still applies.',
      de: 'Ich möchte, dass die Freischaltung sofort beginnt. Mir ist bewusst, dass ich damit mein Widerrufsrecht von 14 Tagen für digitale Inhalte verliere. Die freiwillige <a href="{refund}" target="_blank">Erstattungsregelung</a> gilt weiterhin.',
      fr: 'Je souhaite que le déblocage commence immédiatement. Je comprends que je perds ainsi mon droit de rétractation de 14 jours pour les contenus numériques. La <a href="{refund}" target="_blank">politique de remboursement</a> volontaire continue de s\'appliquer.',
      es: 'Quiero que el desbloqueo empiece de inmediato. Entiendo que con ello pierdo el derecho de desistimiento de 14 días para contenidos digitales. La <a href="{refund}" target="_blank">política de reembolso</a> voluntaria sigue siendo válida.'
    },
    'm.hint': {
      en: 'Tick the box above, then press the order button.',
      de: 'Setze oben den Haken und klicke dann auf den Bestellbutton.',
      fr: 'Cochez la case ci-dessus, puis cliquez sur le bouton de commande.',
      es: 'Marca la casilla de arriba y pulsa después el botón de pedido.'
    },
    'm.seller': {
      en: 'Sold by Mario Behrends (' + A_IMP + '). Questions: ' + SUP + '.',
      de: 'Verkauft von Mario Behrends (' + A_IMP + '). Fragen: ' + SUP + '.',
      fr: 'Vendu par Mario Behrends (' + A_IMP + '). Questions: ' + SUP + '.',
      es: 'Vendido por Mario Behrends (' + A_IMP + '). Preguntas: ' + SUP + '.'
    },
    'pp.loading': { en: 'Loading PayPal…', de: 'PayPal wird geladen…', fr: 'Chargement de PayPal…', es: 'Cargando PayPal…' },
    'pp.error': {
      en: 'PayPal could not load. Check your connection or ad blocker and try again.',
      de: 'PayPal konnte nicht geladen werden. Prüfe deine Verbindung oder deinen Werbeblocker und versuche es noch einmal.',
      fr: 'PayPal n\'a pas pu se charger. Vérifiez votre connexion ou votre bloqueur de publicités et réessayez.',
      es: 'No se pudo cargar PayPal. Revisa tu conexión o tu bloqueador de anuncios e inténtalo de nuevo.'
    },
    'pay.err': {
      en: 'The payment did not go through. Nothing was charged. Please try again.',
      de: 'Die Zahlung ist nicht durchgegangen. Es wurde nichts abgebucht. Bitte versuche es noch einmal.',
      fr: 'Le paiement n\'a pas abouti. Rien n\'a été débité. Veuillez réessayer.',
      es: 'El pago no se completó. No se ha cobrado nada. Inténtalo de nuevo.'
    },
    'thanks.h': {
      en: 'Thank you, payment received',
      de: 'Danke, die Zahlung ist angekommen',
      fr: 'Merci, paiement reçu',
      es: 'Gracias, hemos recibido tu pago'
    },
    'thanks.order': { en: 'Your order ID:', de: 'Deine Bestellnummer:', fr: 'Votre numéro de commande:', es: 'Tu número de pedido:' },
    'thanks.keep': {
      en: '<strong>Keep this order ID.</strong> The full unlock is now active in this browser. If anything is missing or you change browsers, contact ' + SUP + ' with your order ID.',
      de: '<strong>Bewahre diese Bestellnummer auf.</strong> Die volle Freischaltung ist jetzt in diesem Browser aktiv. Wenn etwas fehlt oder du den Browser wechselst, schreib an ' + SUP + ' und nenne deine Bestellnummer.',
      fr: '<strong>Conservez ce numéro de commande.</strong> Le déblocage complet est maintenant actif dans ce navigateur. S\'il manque quelque chose ou si vous changez de navigateur, écrivez à ' + SUP + ' en indiquant votre numéro de commande.',
      es: '<strong>Guarda este número de pedido.</strong> El desbloqueo completo ya está activo en este navegador. Si falta algo o cambias de navegador, escribe a ' + SUP + ' con tu número de pedido.'
    },
    'thanks.print': {
      en: 'Print your chart now',
      de: 'Vorlage jetzt drucken',
      fr: 'Imprimer la grille maintenant',
      es: 'Imprimir el patrón ahora'
    },

    // ---- Footer ----
    'foot.guides': {
      en: 'Guides and DMC color charts',
      de: 'Anleitungen und DMC-Farbtabellen (auf Englisch)',
      fr: 'Guides et nuanciers DMC (en anglais)',
      es: 'Guías y cartas de colores DMC (en inglés)'
    },
    'foot.support': { en: 'Support:', de: 'Support:', fr: 'Support:', es: 'Soporte:' },
    'foot.links': {
      en: '<a href="{imprint}">Imprint</a> · <a href="{terms}">Terms</a> · <a href="{privacy}">Privacy</a> · <a href="{refund}">Refunds</a> · <a href="{withdraw}">Withdraw from contract</a>',
      de: '<a href="{imprint}">Impressum</a> · <a href="{terms}">AGB</a> · <a href="{privacy}">Datenschutz</a> · <a href="{refund}">Erstattung</a> · <a href="{withdraw}">Vertrag widerrufen</a>',
      fr: '<a href="{imprint}">Mentions légales</a> · <a href="{terms}">Conditions</a> · <a href="{privacy}">Confidentialité</a> · <a href="{refund}">Remboursements</a> · <a href="{withdraw}">Se rétracter du contrat</a>',
      es: '<a href="{imprint}">Aviso legal</a> · <a href="{terms}">Condiciones</a> · <a href="{privacy}">Privacidad</a> · <a href="{refund}">Reembolsos</a> · <a href="{withdraw}">Desistir del contrato</a>'
    },
    // ---- Newsletter form (hidden until BUTTONDOWN_USERNAME is set in config.js) ----
    'nl.h': {
      en: 'Cross-stitch tips by email',
      de: 'Kreuzstich-Tipps per E-Mail',
      fr: 'Des conseils de point de croix par e-mail',
      es: 'Consejos de punto de cruz por correo'
    },
    'nl.label': { en: 'Email', de: 'E-Mail', fr: 'E-mail', es: 'Correo electrónico' },
    'nl.ph': { en: 'you@example.com', de: 'du@beispiel.de', fr: 'vous@exemple.fr', es: 'tu@ejemplo.es' },
    'nl.btn': { en: 'Subscribe', de: 'Abonnieren', fr: 'S\'abonner', es: 'Suscribirme' },
    'nl.hint': {
      en: 'At most 1 email a week, sent through Buttondown (USA). You confirm by email first and can unsubscribe in every issue. See the <a href="{privacy}">privacy policy</a>.',
      de: 'Höchstens 1 E-Mail pro Woche, versendet über Buttondown (USA). Du bestätigst zuerst per E-Mail und kannst dich in jeder Ausgabe abmelden. Siehe <a href="{privacy}">Datenschutz</a>.',
      fr: 'Au plus 1 e-mail par semaine, envoyé via Buttondown (États-Unis). Vous confirmez d\'abord par e-mail et pouvez vous désabonner dans chaque envoi. Voir la <a href="{privacy}">politique de confidentialité</a>.',
      es: 'Como máximo 1 correo por semana, enviado a través de Buttondown (EE. UU.). Primero confirmas por correo y puedes darte de baja en cada envío. Consulta la <a href="{privacy}">política de privacidad</a>.'
    },
    'foot.note': {
      en: 'FlossChart is not affiliated with DMC. DMC is a trademark of its owner. Floss colors are approximations.',
      de: 'FlossChart steht in keiner Verbindung zu DMC. DMC ist eine Marke ihres Inhabers. Garnfarben sind Näherungen.',
      fr: 'FlossChart n\'est pas affilié à DMC. DMC est une marque de son propriétaire. Les couleurs des fils sont des approximations.',
      es: 'FlossChart no tiene relación con DMC. DMC es una marca de su propietario. Los colores de los hilos son aproximaciones.'
    },

    // ---- Messages from app.js ----
    'alert.notimage': {
      en: 'Please choose an image file (JPG, PNG or WebP).',
      de: 'Bitte wähle eine Bilddatei (JPG, PNG oder WebP).',
      fr: 'Veuillez choisir un fichier image (JPG, PNG ou WebP).',
      es: 'Elige un archivo de imagen (JPG, PNG o WebP).'
    },
    'alert.unreadable': {
      en: 'This image could not be read. Try a JPG or PNG.',
      de: 'Dieses Bild konnte nicht gelesen werden. Versuche es mit einer JPG- oder PNG-Datei.',
      fr: 'Cette image n\'a pas pu être lue. Essayez un fichier JPG ou PNG.',
      es: 'No se pudo leer esta imagen. Prueba con un JPG o un PNG.'
    },
    'pdf.preparing': { en: 'Preparing PDF…', de: 'PDF wird erstellt…', fr: 'Préparation du PDF…', es: 'Preparando el PDF…' },
    'pdf.error': {
      en: 'The PDF could not be made. Check your connection and try again, or use Print.',
      de: 'Das PDF konnte nicht erstellt werden. Prüfe deine Verbindung und versuche es noch einmal oder nutze "Vorlage drucken".',
      fr: 'Le PDF n\'a pas pu être créé. Vérifiez votre connexion et réessayez, ou utilisez "Imprimer la grille".',
      es: 'No se pudo crear el PDF. Revisa tu conexión e inténtalo de nuevo, o usa "Imprimir el patrón".'
    },
    'support.fallback': { en: 'our support page', de: 'unsere Support-Seite', fr: 'notre page de support', es: 'nuestra página de soporte' },

    // ---- Print view and PDF labels ----
    'print.title': {
      en: 'Cross-stitch chart',
      de: 'Kreuzstich-Stickvorlage',
      fr: 'Grille de point de croix',
      es: 'Patrón de punto de cruz'
    },
    'print.sub': {
      en: '{w} x {h} stitches · {n} DMC colors · {p} chart page(s)',
      de: '{w} x {h} Stiche · {n} DMC-Farben · {p} Vorlagenseite(n)',
      fr: '{w} x {h} points · {n} couleurs DMC · {p} page(s) de grille',
      es: '{w} x {h} puntos · {n} colores DMC · {p} página(s) de patrón'
    },
    'print.size': { en: 'Finished size:', de: 'Fertige Größe:', fr: 'Taille finale:', es: 'Tamaño final:' },
    'size.item': { en: '{c} count {a} x {b} cm', de: '{c} count {a} x {b} cm', fr: '{c} count {a} x {b} cm', es: '{c} count {a} x {b} cm' },
    'size.item.pdf': { en: '{c} ct {a} x {b} cm', de: '{c} ct {a} x {b} cm', fr: '{c} ct {a} x {b} cm', es: '{c} ct {a} x {b} cm' },
    'print.alt.preview': { en: 'Pattern preview', de: 'Vorschau der Vorlage', fr: 'Aperçu de la grille', es: 'Vista previa del patrón' },
    'print.alt.page': { en: 'Chart page', de: 'Vorlagenseite', fr: 'Page de grille', es: 'Página del patrón' },
    'print.note': {
      en: 'Made with FlossChart. Bold lines every 10 stitches. Numbers show stitch positions.',
      de: 'Erstellt mit FlossChart. Fette Linien alle 10 Stiche. Die Zahlen zeigen die Stichpositionen.',
      fr: 'Créé avec FlossChart. Traits épais tous les 10 points. Les numéros indiquent la position des points.',
      es: 'Hecho con FlossChart. Líneas gruesas cada 10 puntos. Los números indican la posición de los puntos.'
    },
    'print.page': {
      en: 'Page {a} of {b} · columns {c1} to {c2}, rows {r1} to {r2}',
      de: 'Seite {a} von {b} · Spalten {c1} bis {c2}, Reihen {r1} bis {r2}',
      fr: 'Page {a} sur {b} · colonnes {c1} à {c2}, rangs {r1} à {r2}',
      es: 'Página {a} de {b} · columnas {c1} a {c2}, filas {r1} a {r2}'
    },
    'pdf.title': {
      en: 'Cross-stitch chart {w} x {h}',
      de: 'Kreuzstich-Stickvorlage {w} x {h}',
      fr: 'Grille de point de croix {w} x {h}',
      es: 'Patrón de punto de cruz {w} x {h}'
    },
    'pdf.note': {
      en: 'Made with FlossChart. Bold lines every 10 stitches. Screen colors are approximations of real thread.',
      de: 'Erstellt mit FlossChart. Fette Linien alle 10 Stiche. Bildschirmfarben sind Näherungen an echtes Garn.',
      fr: 'Créé avec FlossChart. Traits épais tous les 10 points. Les couleurs à l\'écran sont des approximations du fil réel.',
      es: 'Hecho con FlossChart. Líneas gruesas cada 10 puntos. Los colores en pantalla son aproximaciones del hilo real.'
    }
  };

  var lang = 'en';
  var listeners = [];

  function isLang(l) { return LANGS.indexOf(l) !== -1; }
  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  function detect() {
    var m = /[?&]lang=([a-zA-Z-]+)/.exec(window.location.search);
    var q = m && m[1].toLowerCase().split('-')[0];
    if (q && isLang(q)) return q;
    // Static language pages (index.de.html and so on) carry their language on <html data-page-lang>.
    var fixed = document.documentElement.getAttribute('data-page-lang');
    if (fixed && isLang(fixed)) return fixed;
    var saved = store(function (s) { return s.getItem(KEY); });
    if (saved && isLang(saved)) return saved;
    var prefs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i] || '').toLowerCase().split('-')[0];
      if (isLang(p)) return p;
    }
    return 'en';
  }

  // Price written the local way: €5 in English, 5 € (with a no-break space) elsewhere.
  function price() {
    var v = String(cfg.PRICE || '').replace(/\.00$/, '').replace('.', ',');
    var cur = cfg.CURRENCY === 'EUR' ? '€' : cfg.CURRENCY;
    if (lang === 'en') return cur === '€' ? '€' + v : cur + ' ' + v;
    return v + ' ' + cur;
  }

  // Legal page in the current language: terms.html for en, terms.de.html for de, and so on.
  function page(name) { return name + (lang === 'en' ? '' : '.' + lang) + '.html'; }

  function t(key, vars) {
    var e = D[key];
    var s = e ? (e[lang] || e.en) : key;
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      if (vars && vars[k] !== undefined) return vars[k];
      if (k === 'price') return price();
      if (k === 'refund' || k === 'imprint' || k === 'terms' || k === 'privacy' || k === 'withdraw') return page(k);
      return m;
    });
  }

  function setMeta(sel, attr, val) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  }

  function apply() {
    var root = document.documentElement;
    root.lang = lang;
    document.title = t('meta.title');
    setMeta('meta[name="description"]', 'content', t('meta.desc'));
    setMeta('meta[property="og:title"]', 'content', t('meta.title'));
    setMeta('meta[property="og:description"]', 'content', t('meta.desc'));
    setMeta('meta[name="twitter:title"]', 'content', t('meta.title'));
    setMeta('meta[name="twitter:description"]', 'content', t('meta.desc'));
    setMeta('meta[property="og:locale"]', 'content', { en: 'en_US', de: 'de_DE', fr: 'fr_FR', es: 'es_ES' }[lang]);
    var i, els;
    els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute('data-i18n'));
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) els[i].innerHTML = t(els[i].getAttribute('data-i18n-html'));
    els = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < els.length; i++) {
      els[i].getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var kv = pair.split(':');
        this.setAttribute(kv[0], t(kv[1]));
      }, els[i]);
    }
    els = document.querySelectorAll('.langsw button');
    for (i = 0; i < els.length; i++) els[i].setAttribute('aria-pressed', els[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    listeners.forEach(function (fn) { fn(lang); });
  }

  function set(l, remember) {
    if (!isLang(l)) return;
    lang = l;
    if (remember) {
      store(function (s) { s.setItem(KEY, l); });
      try {
        var u = new URL(window.location.href);
        u.searchParams.set('lang', l);
        window.history.replaceState(null, '', u.toString());
      } catch (e) { /* URL rewrite is optional */ }
    }
    apply();
  }

  lang = detect();
  window.I18N = {
    LANGS: LANGS, D: D, t: t, price: price, page: page,
    get lang() { return lang; },
    set: function (l) { set(l, true); },
    apply: apply,
    onChange: function (fn) { listeners.push(fn); }
  };

  var sw = document.querySelectorAll('.langsw button');
  for (var i = 0; i < sw.length; i++) {
    sw[i].addEventListener('click', function (e) { set(e.currentTarget.getAttribute('data-lang'), true); });
  }
  apply();
})();
