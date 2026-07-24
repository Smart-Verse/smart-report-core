# smart-report-core — Handoff

## Responsabilidade

Serviço isolado que recebe HTML completo e devolve PDF. Não monta templates, interpreta JSON de negócio nem persiste dados.

## Contrato

`POST /report` recebe `{"report":"<html>...</html>"}` e devolve `application/pdf`, inline como `generated.pdf`. Renderização A4 com backgrounds via Puppeteer.

## Execução

```bash
npm install
node index.js
node --check index.js
```

Porta fixa 5071; Chrome esperado em `/usr/bin/google-chrome-stable`.

## Dependência

`smart-report-backend/services/report/ReportClient.java` chama `http://localhost:5071/report`. Coordenar mudanças de porta, rota ou contrato com o backend.

## Riscos

- Sem autenticação, timeout, limite de payload, healthcheck ou testes reais.
- Browser pode permanecer aberto em falhas.
- Erros podem devolver conteúdo sensível.
- Recursos externos não possuem espera explícita.
- HTML não confiável roda com `--no-sandbox`; manter o serviço isolado.
- Dependências MongoDB e Mustache estão declaradas, mas não são usadas no fluxo atual.
