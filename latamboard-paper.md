# On the missing benchmarks layer and a potential solution

## 0. abstract

Latin America is missing a foundational layer for **native AI development**: a shared evaluation layer for artificial intelligence. This deficit produces two costs. Public institutions procure foreign models and AI systems without reliable instruments to test performance and alignment on Latin American languages, jurisdictions, health practices, administrative procedures, and social contexts. Companies can access general-purpose models but cannot systematically optimize them for regionally relevant workflows because there's a missing optimization direction. The dependency is sequential: **data → benchmarks → models → systems → local models for regulation, market fit, and autonomy**. Latin America has researchers, engineers, domain expertise, and open-source software. It lacks infrastructure that converts these assets into maintained, reproducible, regionally relevant evaluations. This chain is not strictly linear: benchmarks can be built from existing datasets, and models can be deployed without complete evaluation layers. The argument is about quality and relevance, not strict impossibility. This paper argues that **Latin America needs these two missing layers --benchmarks & data-- to develop its own native AI systems**. It focuses on the benchmark layer and proposes an **EvalsHub**, with **LatamBoard** as its first regional instance: an open, task-first infrastructure where universities, public institutions, professional communities, and companies can publish, execute, compare, and maintain evaluations across models, workflows, and agents.

## 1. introduction

“**All of frontier AI is generated elsewhere**” describes the operating condition under which most Latin American institutions encounter artificial intelligence. US is developing its own models (GPT, Claude, Gemini), China is doing the same (DeepSeek, Kimi, GLM), and France (and Europe) is following closely behind (Mistral). As of 2026, these are the main AI poles in the world. The cloud infrastructure, model repositories, evaluation suites, commercial interfaces, and software frameworks used to consume these systems are also concentrated primarily outside Latin America.

Latin American private and public organizations can adapt, fine-tune, integrate, and deploy foreign models. They rarely control the artifacts that determine what those models know, how their capabilities are measured, or which regional use cases receive sustained engineering attention. This creates a measurement dependency in addition to a supply dependency.

A Colombian public agency may need to classify citizen requests according to national administrative categories. A Mexican hospital network may need to structure clinical documentation using local terminology and escalation procedures. A Brazilian financial institution may need to extract obligations from Portuguese-language contracts. A supplier can report scores on MMLU, BIG-bench, multilingual tests, or proprietary evaluations. Those scores do not establish whether the system performs these regional tasks correctly.

Contemporary AI engineering increasingly involves prompt-program optimization, retrieval configuration, tool selection, workflow design, routing, output validation, and inference parameters rather than only parameter training. Tools such as DSPy, MIPRO, and GEPA enable prompt-program optimization against defined metrics (see §4.2). [Khattab et al. (2023); Opsahl-Ong et al. (2024); Agrawal et al. (2025)]

Discussion of AI infrastructure often begins with GPUs. Accelerators are necessary, but they do not convert regional expertise into usable AI capability. A region also needs data, annotation procedures, benchmark definitions, evaluation protocols, software tooling, governance, and institutional maintenance.

This paper targets the benchmark layer. Its companion, *On the missing data layer and a potential solution*, addresses DataHub: a task-first data infrastructure organized through the ontology `/<task?>/<domain?>/<language?>`, with mechanisms for dataset discovery, metadata, contribution, licensing, and reuse. DataHub concerns the supply and discovery of data. LatamBoard concerns the formal definition of a task, expected behavior, scoring rule, and reproducible comparison. A dataset can support a benchmark, but a dataset alone is not a benchmark.

The thesis is direct: **Latin America needs these missing layers — benchmarks and data — to develop its own native AI systems.** Latin America does not need to begin by reproducing the largest frontier laboratories. It needs regional infrastructure that makes imported systems auditable, local workflows improvable, and future local models possible.

## 2. the problem: the dependency-chain tail

A benchmark is a formal claim about a capability. It defines which inputs matter, what output is correct, how performance is scored, and which population or operating environment the test represents.

Benchmark construction converts data into an evaluation task. A benchmark for extracting entities from a Brazilian procurement document requires an entity taxonomy, annotation policy, treatment of nested and ambiguous entities, train and test splits, and a scoring method. A benchmark for summarizing an Argentine legal filing requires criteria for procedural completeness, legal fidelity, omission, and unsupported claims. A benchmark for agricultural image classification in Colombia requires categories that reflect local crops, pests, diseases, and imaging conditions.

Benchmarks support model development. Developers use evaluation results to choose architectures, training mixtures, post-training methods, and model variants. A local team cannot determine whether a model improved on tasks relevant to its users if those tasks are not measured. A model may score well on MMLU or GSM8K and still fail on Brazilian legal classifications, Indigenous languages, local biomedical terminology, or public-sector workflows.

They also support system development. Production AI is rarely a model in isolation; it is a compound system consisting of a model, retrieval layer, prompt program, tools, routing, memory, guardrails, and human review. A procurement agency evaluating document processing must test the complete system that receives documents, retrieves references, produces an output, and triggers an action. Model-card scores cannot substitute for system-level evaluation.

Local model capacity follows from these requirements. Local models can be necessary for three reasons.

First, regulation may restrict the transmission of sensitive data to foreign providers or require local processing, audit access, or specific accountability procedures. Brazil’s General Data Protection Law, Mexico’s data-protection regime, and sectoral rules governing health, finance, and public administration create requirements that a generic foreign API may not satisfy without additional controls. [Lei nº 13.709/2018 (LGPD); LFPDPPP (2010)]

Second, market fit may be too specific for a model optimized for the largest global markets. A model trained primarily on United States legal categories, English-language commercial data, or European administrative conventions may not deliver sufficient value in a Latin American workflow.

Third, autonomy requires the ability to maintain critical capabilities when external access changes. Autonomy here means strategic autonomy — the ability to choose, adapt, and replace systems — not necessarily technological autonomy in the sense of reproducing frontier model training. The United States export-control regime demonstrates the point. The Bureau of Industry and Security imposed major restrictions on advanced computing and semiconductor manufacturing exports to China in October 2022 and expanded them in October 2023 and January 2025. NVIDIA developed China-specific products in response to earlier restrictions, while Chinese firms faced a more constrained supply environment for advanced accelerators and related technologies. [BIS (2022); BIS (2023); BIS (2025); NVIDIA (2022); NVIDIA (2023)]

The **Fable scenario** makes the dependency concrete. Imagine a Latin American organization that builds a critical workflow around a foreign AI service called Fable. The service is available today, but a foreign government changes export rules, the provider exits the market, payment channels are interrupted, or the provider closes the product. The organization does not possess regional evaluation data, a documented performance history, a compatible open model, or an internal system that can be retuned against local tasks. It cannot produce a substitute at the moment of interruption. It is a dependency fable: access can be withdrawn or politically conditioned, and autonomy cannot be improvised after the fact.

The causal sequence is therefore concrete:

1. Without regional data, local tasks remain poorly represented.
2. Without local tasks, regional benchmarks cannot define measurable targets.
3. Without benchmarks, model developers cannot optimize for regional performance.
4. Without model and system evaluation, institutions cannot identify which adaptations improve actual workflows.
5. Without an evaluation history, local models cannot inherit tested objectives, failure cases, and deployment requirements.
6. Without these prior layers, a region may possess engineers and compute yet remain dependent on external systems and external definitions of quality.

### 2.1 — what exists here

Latin America has substantial components of the chain. The University of São Paulo, the Federal University of Minas Gerais, the University of Buenos Aires, the University of Chile, the National University of Colombia, and Tecnológico de Monterrey train researchers in machine learning and language technologies. Brazil’s EMBRAPII network, Argentina’s CONICET, Chile’s CORFO and CENIA, Mexico’s research universities and CONAHCyT institutions, and Colombia’s MinCiencias support research and applied innovation.

Regional groups have created data, annotation schemes, language models, shared tasks, and evaluation code. These artifacts cover Brazilian Portuguese, Spanish, Indigenous and Americas languages, legal and biomedical language, speech, semantic similarity, named-entity recognition, question answering, and other regional tasks. Chilean institutions, including CENIA, have supported LatamGPT efforts intended to improve representation of Latin American language and knowledge. [Wagner Filho et al. (2018); Real et al. (2020); Santos et al. (2006); Luz de Araujo et al. (2018); B2W Digital (2019); Cañete et al. (2020); García Cumbreras et al. (2019); Mager et al. (2021); LatamGPT Project (2025)]

Companies such as SURUS and technology teams across the region use open models, retrieval systems, document processing, speech recognition, and model-serving infrastructure. Regional institutions therefore possess domain knowledge, engineering capacity, and portions of the data required by the chain.

### 2.2 — what exists outside

Outside Latin America, the chain is supported by integrated ecosystems. Google DeepMind, OpenAI, Anthropic, Meta, Mistral AI, Cohere, and AI21 Labs develop models and publish or internally maintain evaluations. Stanford’s HELM evaluates models across scenarios and dimensions. EleutherAI’s evaluation harness supports repeatable testing across tasks and model families. Hugging Face provides repositories for models and datasets, while its Open LLM Leaderboard provides a public comparison surface for open-weight models.

Frameworks such as DSPy, LlamaIndex, LangChain, and vLLM connect models to production systems. These ecosystems include not only models but also benchmark definitions, runners, metadata, versioning, documentation, and maintainers.

### 2.3 — why what exists here is insufficient

Latin America’s components remain disconnected. Data projects are often published as papers or appendices without maintained execution layers. Model projects may report results on external benchmarks that do not represent local tasks. Companies may evaluate systems privately using proprietary test sets. Public institutions may procure systems without an independent instrument to validate supplier claims.

Regional expertise does not reliably become a reusable benchmark; a benchmark does not reliably become a maintained runner; and a runner does not reliably produce comparable results across models and systems. Without this sequence, local development stops before model training begins. The region imports not only models and compute but also the objectives against which systems are improved.

## 3. the missing benchmark layer

The benchmark deficit creates two related costs. The first is a public-institution and sovereignty problem: systems cannot be independently audited against regional requirements. The second is an industrial optimization problem: companies cannot direct improvement toward tasks that matter locally.

### 3.1 — public institutions and the loss of auditability

#### what exists here

Latin American public institutions possess domain authority and relevant records. Brazil’s Tribunal de Contas da União and Conselho Nacional de Justiça have examined the governance and use of AI in public institutions. Colombia’s MinCiencias and national government have developed AI policy and research initiatives. Chile, Mexico, Argentina, Uruguay, and Costa Rica have adopted AI strategies, modernization programs, or regulatory proposals. [Estratégia Brasileira de IA; Política Nacional de IA (Chile); TCU/CNJ AI governance reports]

Universities, courts, ministries, hospitals, and civil-society organizations understand the consequences of errors in public administration, health, justice, education, and social services. Their limitation is the absence of a shared, maintained mechanism for converting that knowledge into independent evaluations.

#### what exists outside

Foreign providers publish model cards, system cards, safety reports, and broad benchmark results. OpenAI, Anthropic, Google DeepMind, and Meta report results on reasoning, coding, multilinguality, instruction following, and safety. The comparison points and evaluation ecosystems discussed in §5 provide useful technical resources, while Microsoft Azure, Google Cloud, and Amazon Web Services expose foreign models and monitoring tools to Latin American customers.

These resources support initial technical analysis but do not constitute a regional audit instrument.

#### why what exists here is insufficient

A vendor score on a general benchmark cannot establish that a model correctly interprets a Colombian administrative form. A multilingual score cannot establish that a system handles Argentine legal vocabulary or Brazilian institutional Portuguese. A general safety evaluation cannot determine whether a public-health assistant follows the protocols and escalation rules of a national health system.

The supplier knows the model’s training and evaluation environment. The institution knows the local consequences of failure but lacks a shared method to measure them. Without independent benchmarks, procurement defaults to vendor documentation, demonstrations, or generic scores. That is a transfer of trust, not an audit function.

### 3.2 — industry and the loss of optimization direction

#### what exists here

Regional companies use foreign APIs, open-weight models, retrieval-augmented generation, and document workflows across finance, health, legal services, and public administration. These teams possess practical knowledge of important workflows and often create internal test sets.

Regional datasets and shared tasks described in §2.1 provide useful components. They demonstrate that regional communities can define tasks and compare systems, even though those artifacts are not connected through a common execution and maintenance layer.

#### what exists outside

These ecosystems include optimization frameworks (see §4.2). EleutherAI’s `lm-evaluation-harness`, Hugging Face evaluation tooling, OpenAI evaluation tools, and Anthropic’s evaluation guidance provide additional mechanisms for systematic testing. [Khattab et al. (2023); Opsahl-Ong et al. (2024); Agrawal et al. (2025)]

A team can vary prompts, demonstrations, retrieval sources, ranking settings, tool policies, workflow structure, routing, output schemas, abstention thresholds, and inference parameters without retraining every model parameter. Each change requires a stable target.

#### why what exists here is insufficient

Internal tests are often private, small, unstable, or designed for debugging rather than measurement. They may lack documented sampling procedures, difficult cases, version control, confidence intervals, or subgroup analysis. A team can improve its score on a narrow test while reducing performance in production. Other companies cannot reproduce the result, and public institutions cannot use it for procurement.

The region consequently imports optimization objectives. A Latin American team may optimize a workflow against English-language or United States-centered tasks because no regional benchmark is available. The machinery exists; the regional target remains fragmented.

## 4. what the benchmark layer does

A benchmark has two primary functions: it audits an AI system and directs its improvement. The same artifact can serve both purposes when its task definition, scoring method, and execution protocol are explicit.

### 4.1 — audit

A benchmark fixes the examination while allowing the system under examination to vary. It specifies:

- the task and operating context;
- the domain, jurisdiction, and language variety;
- the input and output schema;
- the reference answer or accepted answer set;
- the treatment of ambiguity, uncertainty, and abstention;
- the scoring function;
- the sampling and versioning procedure; and
- the execution protocol.

A public agency can run the same benchmark against GPT, Claude, Gemini, Llama, Mistral, a regional model, or a complete production workflow. It can compare accuracy, refusal behavior, latency, cost, calibration, and other procurement-relevant dimensions. The benchmark supplies evidence; it does not make the procurement decision.

A regional benchmark should apply to foreign or regional AI systems alike. Local origin does not guarantee suitability. A Brazilian model may fail on a medical task; a United States model may perform well on a narrow Spanish-language workflow; an open model may be unsuitable because its license conflicts with public-sector requirements. Origin is a governance fact, not a performance metric.

### 4.2 — optimization

For an industry team, a benchmark is an objective function. Given a starting system and a fixed evaluation artifact, the team can search for changes that improve the intended task. Possible changes include prompt instructions, retrieval sources, tool-selection rules, workflow topology, model routing, output schemas, abstention thresholds, inference parameters, and human-review triggers.

DSPy provides a useful conceptual model by representing language-model applications as programs whose components can be optimized against metrics. MIPRO-style methods search over candidate instructions and demonstrations. GEPA-style methods use textual feedback to guide program improvement. Each depends on a measurable target.

This optimization-of-programs paradigm — the **software 3.0 stack** of prompt-program optimizers and workflow-architecture search — treats natural-language instructions, retrieval configurations, and workflow structures as code to be compiled and optimized. It makes the benchmark the compiler objective function: optimization can only aim at what is measured.

A benchmark can unlock system improvement before a team has resources to train a foundation model. It does not eliminate the need for data, training, or compute; it provides a disciplined basis for deciding whether those investments improve regional performance.

### 4.3 — one artifact, two consumers

A public institution can publish or access a benchmark, run it against candidate systems, and use results for procurement and oversight. An industry team can use the same artifact during development, optimize its workflow, and rerun it after each change. Universities can use it for research and teaching, while professional communities can review whether its definition of correctness reflects their field.

The benchmark must remain stable enough to support comparison and flexible enough to evolve. Versions should preserve the task definition and scoring rules while documenting additions, corrections, sampling changes, and known limitations. Results should identify the system version, inference settings, workflow configuration where disclosure is possible, and execution date.

The value lies in the sequence of measurements rather than one ranking. Results across GPT, Claude, Gemini, Llama, Mistral, regional models, and production workflows can reveal progress, regressions, cost-performance trade-offs, and domain-specific failures.

## 5. state of evaluation in Latin America

### 5.1 — regional research and shared tasks

#### what exists here

Latin America has produced concrete evaluation resources, especially in natural language processing. Brazilian Portuguese resources include ASSIN (semantic similarity), HAREM (named-entity recognition), and LeNER-Br (legal entities). [Real et al. (2020); Santos et al. (2006); Luz de Araujo et al. (2018); Wagner Filho et al. (2018); B2W Digital (2019)]

Spanish-language researchers associated with the University of Chile developed BETO, a Spanish-language BERT model. Latin American researchers have participated in IberLEF shared tasks, while AmericasNLP has organized evaluation work involving Indigenous and Americas languages. Chilean institutions, including CENIA, have supported LatamGPT-related model-development efforts. The institutions named in section 1 contribute papers, datasets, and task-specific evaluations in legal information, biomedical text, speech recognition, machine translation, misinformation, political discourse, and civic language. [Cañete et al. (2020); García Cumbreras et al. (2019); Mager et al. (2021); LatamGPT Project (2025)]

These contributions show that regional researchers can define tasks, assemble data, write evaluation code, and compare systems.

#### what exists outside

Outside Latin America, evaluation is integrated into model-development ecosystems. GLUE and SuperGLUE standardized English-language understanding tasks. MMLU evaluates broad academic and professional knowledge. BIG-bench provides a large collection of contributed tasks. HELM evaluates models across scenarios and metrics rather than reducing performance to one aggregate score. Hugging Face’s Open LLM Leaderboard provides public comparison for open-weight models. EleutherAI’s evaluation harness supports repeatable execution across tasks and model families. [Wang et al. (2018); Wang et al. (2019); Hendrycks et al. (2020); Srivastava et al. (2022); Liang et al. (2022)]

These projects combine task definitions, scoring methods, software, documentation, model records, and public result surfaces. Their persistence is part of their value.

#### why what exists here is insufficient

The problem is not the absence of regional research but the absence of a shared execution and maintenance layer. Regional evaluations are distributed across papers, workshops, repositories, and project websites. Many are single-task initiatives. Some provide a static dataset without a maintained runner, versioned scoring code, public results, or documentation for evaluating current models.
A researcher in Colombia may not find a Portuguese-language medical benchmark from Brazil. A public institution in Mexico may know that an IberLEF task exists but lack a maintained service or protocol for using it in procurement. A company may discover resources through a paper but not find a registry connecting them to current models and system evaluations.

Latin America needs an index and execution layer that turns individual evaluations into cumulative infrastructure.

### 5.2 — frontier evaluation and contextual mismatch

#### what exists here

Regional researchers, professional communities, and public institutions possess the domain knowledge required to define correctness in law, health, agriculture, finance, education, and public administration. Companies and agencies also conduct internal evaluations of document classifiers, fraud systems, speech interfaces, and customer-service workflows. Much of this work remains unpublished because it uses sensitive data or is treated as internal engineering.

The regional contribution is split between public research artifacts described in §5.1 and private or institutional evaluations that are not indexed or reusable.

#### what exists outside

The dominant benchmarks were largely designed by institutions outside Latin America and integrated into frontier model development. MMLU includes many questions authored in English and grounded in United States academic and professional contexts. GLUE and SuperGLUE focus on English-language tasks. BIG-bench is more diverse, but its coverage depends on contributor distribution. HELM provides sophisticated methodology, but its scenarios do not automatically represent Latin American institutions or language varieties. The Open LLM Leaderboard creates visibility for open models, but its task suite is not a regional audit standard.

OpenAI, Anthropic, Google DeepMind, and Meta also conduct internal evaluations using proprietary or restricted datasets. Latin American organizations consume the resulting systems without controlling the definition of success.

#### why what exists here is insufficient

“Spanish” conceals differences in vocabulary, legal categories, health systems, educational systems, and discourse conventions across Mexico, Colombia, Chile, Argentina, Peru, and Spain. “Portuguese” does not distinguish Brazilian institutional usage from European Portuguese. Translating an English benchmark can preserve grammatical form while losing the domain assumptions that determine correctness.

The gap has seven dimensions:

1. **Coverage:** too few benchmarks address Latin American domains, jurisdictions, and language varieties.
2. **Indexing:** existing benchmarks are not discoverable through a common regional registry.
3. **Execution:** many projects lack standardized runners and reproducible scoring.
4. **Maintenance:** ownership, versioning, and re-evaluation schedules are often unclear.
5. **System evaluation:** tests frequently target isolated model calls rather than production workflows.
6. **Governance:** sensitive medical, legal, educational, and public-sector evaluations lack common procedures.
7. **Incentives:** domain experts receive little recognition for converting professional judgment into reusable infrastructure.

The region therefore faces a false choice between generic foreign benchmarks and isolated local tests. It needs interoperable infrastructure with regional task definitions.

### 5.3 — adoption, research, and infrastructure

#### what exists here

AI adoption in Latin America occurs at productive, research, educational, and infrastructural levels. Companies use API-based models, open-weight models, retrieval-augmented generation, transcription, translation, classification, document processing, and agentic workflows. Public institutions explore AI for administration, justice, health, education, and oversight. Universities train researchers and practitioners to develop, adapt, and deploy these systems.

Cloud providers operate across the region. Brazil has substantial academic and industrial computing capacity; other countries maintain research infrastructure at different scales. Open-source communities use GitHub, model repositories, PyTorch, vLLM, and local-serving tools to run and adapt systems.

Regional adoption is therefore broader than regional evaluation infrastructure. There is no widely adopted Latin American equivalent of the major foreign leaderboards, evaluation frameworks, or model-comparison surfaces that indexes regional tasks and repeatedly evaluates models and complete workflows.

#### what exists outside

Outside the region, evaluation is integrated with adoption and infrastructure. Model repositories expose evaluation metadata. Leaderboards connect tasks to models. Harnesses automate execution. Cloud platforms provide scalable inference. Laboratories publish model cards and system cards.

These systems do not solve regional relevance, but they show how evaluation can become a persistent software layer.

#### why what exists here is insufficient

A company may use a foreign API in production without a documented test suite that another organization can inspect. A university may publish a dataset without maintaining a service that runs current models. A public agency may have cloud access but no benchmark owner, domain-review process, or staff responsible for independent evaluation.

The deficit is not reducible to GPUs. Latin America needs infrastructure connecting domain experts, data contributors, benchmark authors, model developers, system builders, and public evaluators.

## 6. an EvalsHub and LatamBoard

We propose a regional **EvalsHub**, with **LatamBoard** ([latamboard.ai](https://latamboard.ai)) as its first instance. LatamBoard would be a public surface where benchmarks created by Latin American universities, public institutions, professional communities, and companies can be published, discovered, executed, and compared across models, workflows, and agents.

The current proposal should not be confused with an operational claim. This paper does not assert that LatamBoard already provides a complete benchmark registry, production runner, scoring service, or comprehensive leaderboard. Those are components to be built, tested, and governed. The site is the proposed institutional and technical entry point.

LatamBoard is complementary to DataHub. DataHub’s `/<task?>/<domain?>/<language?>` ontology organizes data according to intended use and regional context. A DataHub contribution may contain documents, images, speech, or annotations. LatamBoard can use that contribution to define an evaluation split, task schema, reference outputs, and scoring protocol. DataHub addresses discovery and supply; LatamBoard addresses measurement and comparison.

### 6.1 — task-first ontology

LatamBoard uses the structure:

`/<task?>/<domain?>/<language?>`

Task comes first because a benchmark tests a capability. Examples include extraction, classification, detection, transcription, translation, retrieval, summarization, question answering, reasoning, ranking, and structured generation.

Domain comes second because correctness depends on context. Medical extraction is not legal extraction. Agricultural image classification is not financial classification. A system that identifies entities in general news may fail on Brazilian procurement contracts or Mexican clinical records.

Language comes third as a modifier. It includes language code, regional variety, and, where necessary, modality. `/extract/legal/es-AR` identifies a different target from `/extract/legal/es-MX`; `/transcribe/health/pt-BR` identifies a different target from `/transcribe/health/es-CO`. Country and jurisdiction should be additional metadata where legal or institutional context matters. A Spanish-language legal benchmark without jurisdiction metadata is underspecified.

### 6.2 — AI-system agnosticism

The benchmark defines what is tested; the target defines who is tested. The target may be:

- a single model call;
- a model with a fixed system prompt;
- a retrieval-augmented component;
- one node in a larger workflow;
- a complete production workflow; or
- an agent that selects tools and performs multiple steps.

A legal-document benchmark can test GPT, Claude, Llama, Mistral, a locally hosted model, a DSPy program, or an agentic workflow. The execution record should specify the target, version, configuration, external dependencies, and whether human review intervened.

This distinction matters because a model may perform well in isolation but fail when retrieval returns outdated documents. A workflow may outperform the underlying model because it adds structured extraction and verification. An agent may introduce new failures through tool selection or uncontrolled iteration. Evaluation should reflect the system users actually encounter.

### 6.3 — reproducible execution

Each benchmark should include machine-readable metadata, input specifications, reference outputs or grading criteria, scoring code, documentation, licensing information, and a reproducible runner. The record should state whether scoring is deterministic, model-assisted, or human-rated.

LLM-as-judge methods can support open-ended generation, but they introduce evaluator-model bias, calibration requirements, and reproducibility concerns. Human evaluation may be necessary for medical, legal, or nuanced linguistic tasks, but it requires clear protocols, rater training, and quality control. Exact match, F1, edit distance, BLEU, ROUGE, calibration, and task-specific metrics remain appropriate for other settings. LatamBoard should expose the scoring method rather than collapse results into an unexplained number.

Sensitive benchmarks may require local execution or controlled access. The public artifact can expose the task definition, governance rules, metadata, and aggregate results without exposing protected records.

### 6.4 — built once, measured forever

A benchmark should be authored once and measured forever — rerun by an institution each time a new AI system ships, and rerun by an industry team after every change to the system being optimized. Public institutions can evaluate new model or system versions against the same artifact. Industry teams can rerun the test after every change to the system being optimized — this is **continuous performance tracking** and is what a proper optimization target enables. Universities can study model behavior over time.

Repeated measurement does not mean that a benchmark never changes. New examples may be required when a task distribution changes; adversarial cases may be added when systems exploit weaknesses; scoring may be revised when domain experts refine correctness criteria. These changes should be versioned rather than silently replacing the original artifact.

Each version should preserve its relationship to earlier versions. Results should record the benchmark version, target system, configuration, execution date, and relevant resource constraints. This produces an evidence history rather than a sequence of incomparable claims.

## 7. the Access Problem

The supply of regional benchmarks faces a coordination constraint: authorship requires expertise that rarely exists in one person.

### 7.1 — four expertises

**Domain expertise** defines correctness. A physician determines whether a clinical extraction is medically valid. A lawyer determines whether a legal summary preserves the operative rule and procedural posture. An agronomist defines relevant crop, pest, disease, and ambiguity categories.

**Machine-learning engineering** converts domain judgment into schemas, input-output contracts, scoring procedures, and execution interfaces.

**Statistics** determines whether a test represents the operating population. Sampling, class imbalance, confidence intervals, subgroup analysis, and leakage control require statistical judgment.

**Developer operations** packages and maintains the artifact. The benchmark needs versioning, dependency management, result storage, access controls, and documentation. Sensitive data may require local execution or restricted evaluation.

A benchmark for medical entity recognition in Mexican health records requires all four. A clinician defines entities and acceptable abbreviations. An ML engineer defines the schema and F1 calculation. A statistician samples across institutions and specialties. A developer packages the runner and protects patient information.

### 7.2 — what exists here

Latin America has these capabilities separately. Physicians, lawyers, agronomists, statisticians, engineers, and ML researchers work in universities, hospitals, companies, ministries, and professional associations. The institutions named in §2.1 can provide portions of the required capacity; companies possess engineering and operational knowledge, while professional communities possess domain authority.

The shared tasks and datasets described in §2.1 demonstrate that regional communities can define tasks, build datasets, publish metrics, and compare systems. The missing element is coordination, maintenance, and access.

### 7.3 — what exists outside

Outside Latin America, platforms reduce coordination costs. BIG-bench provides conventions for contributed tasks. HELM provides a common evaluation framework. Hugging Face hosts datasets and model metadata. EleutherAI’s harness packages execution. Universities and laboratories maintain benchmark suites with dedicated engineering support.

These systems do not eliminate the need for domain experts. They make it easier for domain expertise to become a usable and maintained artifact.

### 7.4 — why what exists here is insufficient

A physician may know which errors are dangerous but lack the capacity to implement a scoring function. A lawyer may curate difficult cases but be unable to package a reproducible evaluation. An engineer may build a technically sound benchmark without authority to define legal or clinical correctness.

This is the **Access Problem**. The most valuable regional knowledge is held by people who do not typically write benchmark code. Adding compute or general ML engineers does not solve the problem if domain judgment cannot enter the artifact. An EvalsHub must lower the cost of schema design, sampling, scoring, packaging, and execution without lowering the authority of domain review.

Possible mechanisms include guided authoring, reusable task templates, domain-specific scoring modules, assisted sampling, validation workflows, contributor documentation, and review by professional communities. Language models may help with scaffolding, but they cannot define correctness on behalf of the system being evaluated.

## 8. a multipolar position: open by design, incentive-driven by construction

A multipolar AI system requires multiple regions, institutions, languages, and communities to develop and govern AI according to their own needs. Latin America should be able to inspect, compare, adapt, and replace systems when local requirements demand it. This does not require rejecting foreign models or treating local origin as proof of quality.

### what exists here

Latin America has public universities, national research institutions, professional associations, startups, companies, open-source contributors, and research communities capable of contributing to shared evaluation. IberLEF and AmericasNLP demonstrate participation in shared tasks. Companies maintain internal tests that could become public-interest benchmarks under suitable governance.

### what exists outside

The strongest evaluation ecosystems combine open artifacts with sustained support. Hugging Face makes models and datasets discoverable. BIG-bench supports distributed task contribution. HELM publishes evaluation methodology and results. The Open LLM Leaderboard creates visibility. DSPy, EleutherAI’s harness, and vLLM allow organizations to run and adapt systems without relying entirely on proprietary interfaces.

### why what exists here is insufficient

Regional efforts do not yet receive consistent maintenance funding, professional recognition, or shared infrastructure. A researcher may receive publication credit for a dataset but no support to maintain its runner for five years. A public institution may need an evaluation but lack a channel to publish it. A company may hold a valuable benchmark but see no reciprocal benefit in opening it.

LatamBoard should therefore be open by design and incentive-driven by construction. Benchmark definitions, scoring code, metadata, and results should be accessible when privacy, security, and licensing permit. Sensitive benchmarks may require controlled execution, but their governance and methodological claims should remain inspectable.

Incentives should include contributor attribution, institutional visibility, professional recognition, access to other benchmarks, and evidence that a contribution affects procurement or research. Universities can gain recognition for durable evaluation tasks. Public institutions can demonstrate independent oversight. Professional associations can establish domain standards. Companies can exchange selected internal evaluations for comparative regional evidence.

## 9. open questions

### 9.1 — methodological standards

The community needs standards for benchmark schemas, sampling, annotation, scoring, and reporting. Standards should specify when deterministic metrics are appropriate, when human raters are required, and how LLM-as-judge methods should be validated. They should address data leakage, contamination, prompt sensitivity, subgroup performance, confidence intervals, and uncertainty.

Reporting must distinguish model-level evaluation from system-level evaluation. A raw model call should not be presented as equivalent to a retrieval-augmented workflow or tool-using agent. Each result should identify the evaluated target and configuration.

### 9.2 — re-evaluation cadence

High-change domains may require evaluation at every system release. Stable regulatory tasks may require a slower schedule. LatamBoard should support scheduled reruns, historical results, and explicit benchmark versions.

A benchmark maintainer may manage the artifact while participating organizations fund compute. Public-interest benchmarks may require grants, university support, or institutional sponsorship. The cost model must not make regional evaluation dependent on one company’s budget.

### 9.3 — sensitive-domain governance

Medical, legal, educational, employment, and public-sector benchmarks can contain personal or confidential information. They may affect professional standards and public rights. Governance must address consent, de-identification, access control, licensing, annotation authority, and the possibility that public scores encourage unsafe deployment.

A medical benchmark should involve health professionals and appropriate institutional review. A legal benchmark should specify jurisdiction and the role of professional review. A public-sector benchmark should state whether it is suitable for procurement, research, monitoring, or none of these without further validation.

### 9.4 — what a score can and cannot establish

A benchmark score is evidence about a defined task under a defined protocol. It is not a general certificate of intelligence, safety, fairness, or deployment suitability. A high score can coexist with harmful behavior outside the test distribution. A low score may reflect a mismatch between the benchmark and the production task rather than universal model weakness.

LatamBoard should make these limits explicit. Its purpose is not to manufacture a single ranking. It is to make relevant behavior visible, comparable, and improvable.

## 10. invitation to contribute

Talent exists in Latin America. Researchers, engineers, physicians, lawyers, and domain experts already possess the knowledge required to define regional AI tasks. Open source exists as well: PyTorch, Hugging Face, DSPy, EleutherAI’s evaluation harness, vLLM, and open-weight models provide usable technical foundations.

What is missing is infrastructure. The region needs discoverable data, reproducible runners, scoring standards, institutional review, and incentives for long-term maintenance. **These are the things needed to advance at scale.** DataHub can organize the supply and discovery of regional datasets; LatamBoard can turn suitable datasets and expert judgments into measurable, reusable evaluations.

**The talent and open-source foundations exist; the missing piece is shared infrastructure.** Latin America has the people and software required to begin. It lacks the shared systems that allow those resources to compound. A benchmark published without a runner remains difficult to reuse. A runner without versioning produces incomparable results. A score without domain governance does not establish correctness. These elements must be built together to advance at scale.

**Latin America does not need to begin by competing with frontier laboratories.** It does not need to compete with Google DeepMind, OpenAI, Anthropic, Meta, or other frontier laboratories on parameter count and training expenditure. The first step is to build the regional layers that make development possible: evaluation and data.

Evaluation can audit foreign systems today, direct local workflow optimization tomorrow, and provide the measurements required for local models later. DataHub addresses the data layer. LatamBoard addresses the benchmark layer. Together they implement the first segment of the dependency chain:

**data → benchmarks → models → systems → local models for regulation, market fit, and autonomy.**

Universities, public institutions, professional associations, companies, and communities can each contribute tasks, evaluations, and governance through LatamBoard.

The benchmark layer exists only if the community maintains it. Every well-defined task, reproducible runner, documented score, and reviewed contribution reduces the cost of the next project. LatamBoard is proposed as a shared surface for those contributions. Its objective is not a regional leaderboard for its own sake. It is infrastructure that allows Latin America to evaluate what it consumes, direct what it builds, and develop AI according to criteria defined in the region.

## References

- Khattab, O., et al. (2023). DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines. arXiv:2310.03714.
- Opsahl-Ong, K., et al. (2024). Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs. EMNLP 2024. arXiv:2406.11695.
- Agrawal, L.A., et al. (2025). GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. ICLR 2026. arXiv:2507.19457.
- Wagner Filho, J.A., Wilkens, R., Idiart, M., Villavicencio, A. (2018). The brWaC Corpus: A New Open Resource for Brazilian Portuguese. LREC 2018.
- Real, L., Fonseca, E., Gonçalo Oliveira, H. (2020). The ASSIN 2 Shared Task: A Quick Overview. PROPOR 2020. DOI: 10.1007/978-3-030-41505-1_39.
- Santos, D., Seco, N., Cardoso, N., Vilela, R. (2006). HAREM: An Advanced NER Evaluation Contest for Portuguese. LREC 2006.
- Luz de Araujo, P.H., et al. (2018). LeNER-Br: A Dataset for Named Entity Recognition in Brazilian Legal Text. PROPOR 2018. DOI: 10.1007/978-3-319-99722-3_32.
- B2W Digital (2019). B2W-Reviews01. STIL 2019. github.com/americanas-tech/b2w-reviews01.
- Cañete, J., et al. (2020). BETO: Spanish Pretrained BERT. Technical report.
- García Cumbreras, M.Á., et al. (2019). Proceedings of IberLEF 2019. CEUR Workshop Proceedings, Vol-2421.
- Mager, M., et al. (2021). Findings of the AmericasNLP 2021 Shared Task on Open Machine Translation for Indigenous Languages of the Americas. DOI: 10.18653/v1/2021.americasnlp-1.23.
- LatamGPT Project (2025). LatamGPT: Open LLMs for Latin American Spanish. huggingface.co/latam-gpt.
- Wang, A., et al. (2018). GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding. ICLR 2019. arXiv:1804.07461.
- Wang, A., et al. (2019). SuperGLUE: A Stickier Benchmark for General-Purpose Language Understanding Systems. NeurIPS 2019. arXiv:1905.00537.
- Hendrycks, D., et al. (2020). Measuring Massive Multitask Language Understanding. ICLR 2021. arXiv:2009.03300.
- Srivastava, A., et al. (2022). Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models (BIG-bench). TMLR 2023. arXiv:2206.04615.
- Liang, P., et al. (2022). Holistic Evaluation of Language Models (HELM). TMLR 2023. arXiv:2211.09110.
- Biderman, S., et al. (2024). Lessons from the Trenches on Reproducible Evaluation of Language Models. arXiv:2405.14782.
- U.S. Dept. of Commerce, BIS. "Implementation of Additional Export Controls." 87 FR 62186, Oct 13, 2022.
- U.S. Dept. of Commerce, BIS. "Export Controls: Updates and Corrections." 88 FR 73458, Oct 25, 2023.
- U.S. Dept. of Commerce, BIS. "Framework for AI Diffusion." 90 FR 4544, Jan 15, 2025.
- NVIDIA Corp. Form 8-K, SEC EDGAR, Aug 26, 2022. Accession No. 0001045810-22-000146.
- NVIDIA Corp. Form 10-K, SEC EDGAR, Feb 24, 2023. Accession No. 0001045810-23-000017.
- Lei nº 13.709/2018 (LGPD). Lei Geral de Proteção de Dados Pessoais. Brasil, 14 ago. 2018.
- LFPDPPP (2010). Ley Federal de Protección de Datos Personales en Posesión de los Particulares. México, DOF 05-07-2010.
- Estratégia Brasileira de Inteligência Artificial (EBIA). Portaria SGD/MGI nº 6.618, 25 set. 2024.
- Política Nacional de Inteligencia Artificial. MinCiencia, Chile, 2021.
- Estrategia Nacional de Inteligencia Artificial 2024–2030. AGESIC, Uruguay, 21 nov. 2024.
- Hoja de Ruta para la Adopción Ética y Sostenible de la IA en Colombia. Minciencias, 12 feb. 2024.
- Resolução CNJ nº 332/2020. Ética e governança para produção e uso da IA no Poder Judiciário. 8 set. 2020.
- Resolução CNJ nº 616/2025. Inteligência Artificial Generativa no Poder Judiciário. CNJ, 2025.
