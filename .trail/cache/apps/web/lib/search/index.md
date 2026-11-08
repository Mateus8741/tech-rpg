# apps/web/lib/search/index.ts

- Rules · type · L11-L11 — type Rules = typeof import('@repo/rules');
- textFacets · function · L23-L31 — function textFacets(text: string)
- ruleDocs · function · L33-L182 — function ruleDocs(r: Rules): DocInput[]
- className · function · L35-L35 — className = (id: string)
- addTraits · function · L104-L115 — addTraits = (traits: { name: string; description: string }[], owner: string, subraceId?: string)
- RulesCorpus · interface · L184-L187 — interface RulesCorpus
- buildRulesCorpus · function · L190-L195 — function buildRulesCorpus(r: Rules): RulesCorpus
- composeIndex · function · L198-L199 — composeIndex = (corpus: RulesCorpus | null, extra: SearchDoc[]): SearchIndex
