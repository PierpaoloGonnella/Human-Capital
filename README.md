# Human Capital Estimator

Stima la banda di RAL attesa per un ruolo e per la persona che lo ricopre nel mercato del lavoro italiano.

[Apri lo strumento](https://pierpaologonnella.github.io/Human-Capital/)

## A cosa serve

Il questionario restituisce una banda retributiva, un midpoint del ruolo e un punto centrale stimato per la persona. Considera la RAL fissa lorda annua; l’eventuale componente variabile viene indicata separatamente. È pensato per ragionare in modo strutturato sul valore di mercato di una posizione, non per produrre un importo certo.

## Come funziona

La stima segue tre passaggi:

1. **Peso del ruolo** — sette fattori, fra cui competenze, problem solving, autonomia, responsabilità sulle persone e impatto economico, collocano la posizione in una fascia.
2. **Contesto** — settore, area geografica, dimensione aziendale e orario ricalibrano il midpoint rispetto al mercato.
3. **Posizionamento della persona** — esperienza, anzianità, performance, scarsità delle competenze e altri fattori determinano la posizione dentro la banda, senza modificare il peso del ruolo.

## Esecuzione in locale

Non servono dipendenze né un processo di build. Puoi aprire direttamente `index.html` nel browser oppure avviare un server locale dalla cartella del progetto:

```sh
python3 -m http.server
```

Poi visita `http://localhost:8000`.

## Fonti di calibrazione

La calibrazione dichiarata nella pagina si basa su:

- Osservatorio JobPricing, *JP Salary Outlook 2026* (dati 2025);
- decomposizioni AKM della varianza salariale, a partire da Card–Heining–Kline e dalla letteratura successiva, incluso il manifatturiero italiano;
- Sackett et al. (2022) sulla validità dei predittori di performance;
- metodologie di job evaluation Hay/Korn Ferry, Mercer IPE e WTW GGS;
- direttiva (UE) 2023/970 e D.Lgs. 96/2026.

## Privacy

Il questionario e il calcolo vengono eseguiti interamente nel browser: le risposte non vengono inviate né salvate. Le sole richieste esterne caricano i font da Google Fonts e la fotografia di sfondo da Unsplash.

## Limiti

È una stima statistica a scopo informativo, non una consulenza retributiva, legale o contrattuale. Non sostituisce una salary survey e non considera tutte le circostanze individuali, aziendali o i minimi tabellari del CCNL applicato.

## Fotografia

Fotografia di sfondo pubblicata su [Unsplash](https://unsplash.com/photos/0648a3ef77b2).

## Licenza

Distribuito con licenza [MIT](LICENSE).
