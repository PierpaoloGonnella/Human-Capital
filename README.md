# Human Capital Estimator

Strumento statico per stimare una banda di RAL attesa per un ruolo e per la persona che lo ricopre nel mercato del lavoro italiano.

## Aprirlo in locale

Non richiede installazione né build: apri semplicemente `index.html` nel browser. Per usare il questionario serve JavaScript.

## Come funziona

La stima segue tre passaggi:

1. **Peso del ruolo** — sette fattori, fra cui competenze, problem solving, autonomia, responsabilità sulle persone e impatto economico, collocano la posizione in una fascia.
2. **Contesto** — settore, area geografica, dimensione aziendale e orario ricalibrano la fascia rispetto al mercato.
3. **Persona** — esperienza, anzianità nel ruolo e nell’azienda, performance, scarsità delle competenze e altri fattori determinano il posizionamento nella banda, senza cambiare il peso del ruolo.

Il risultato comprende la banda di mercato, il punto centrale stimato e alcuni elementi di interpretazione. La RAL è lorda annua e si riferisce alla componente fissa; quando rilevante, il variabile è indicato separatamente.

## Limiti

Questa è una stima statistica a scopo informativo: non costituisce consulenza retributiva, legale o contrattuale e non tiene conto di tutte le circostanze individuali o aziendali. La retribuzione effettiva può dipendere anche da CCNL, azienda, negoziazione, momento dell’assunzione e altre variabili non osservate.

Nessun dato lascia il browser: il calcolo avviene interamente in locale e nulla viene salvato.

## Licenza

[MIT](LICENSE)
