# On the missing benchmarks layer and a potential solution

## Abstract

Latin America is missing a foundational layer of AI infrastructure: the **benchmark layer** — the layer without which the region cannot **audit** the AI it consumes nor give **direction** to the AI it builds. On the **public-institution side**, almost every AI system in regional use today was built elsewhere, and almost none of it has been measured against the contexts it is being deployed into. On the **industry side**, the absence is structural: modern AI optimization — the software 3.0 stack of prompt-program optimizers & workflow-architecture search — **consumes a benchmark as its input**. No benchmark, no optimization target, no way to adapt a general-purpose model to get the state-of-the-art-performance in a specific industry workflow. The cost of the missing layer is therefore dual: a loss of **auditability** on one side, a loss of **optimization direction** on the other, and together a loss of industrial productivity and sovereign capacity over a technology that is becoming critical infrastructure.

The benchmark layer does two things no other layer can. First, it lets the region **evaluate AI systems it did not build**. Datasets cannot reveal whether a foreign frontier model reasons correctly about a topic of regional interest; only a benchmark, run against the model or AI system, can. This is the audit function — the principal lever public institutions have for governing AI they do not control. Second, the benchmark layer **defines the optimization target** for the AI systems being built and deployed inside the region. Software 3.0-class optimizers — like DSPy [Khattab et al. (2023)] using MIPRO/GEPA-style prompt search algorithms — are programs that take a benchmark and output a more performing and/or aligned AI system. With a proper benchmark, a general-purpose foreign model that underperforms on a regional task can be brought to the needed performance through prompt, workflow-architecture, and inference parameter changes these optimizers discover automatically, with no retraining of the underlying model nor changes to the inference infrastructure required. **One artifact, two consumers, two functions**: a public good for institutions, a private optimization compass for industry, both produced and consumed through the same layer.

A potential solution to this missing layers is an **EvalsHub**, and propose **LatamBoard** ([latamboard.ai](https://latamboard.ai)) as its first regional instance — the Latin American surface where benchmarks built by and for the region are published, runnable, and comparable across AI systems. The hub is organized around a task-first ontology: `/<task?>/<domain?>/<language?>`. **Task** comes first because a benchmark is an exam, and every exam is an exam *for* something — extraction, classification, reasoning. **Domain** comes second: task context matters. **Language** comes third, as a modifyier. The chosen approach is **AI-system agnostic**: the benchmark defines what is being tested; the AI target (model, node, workflow, agent) defines who is being tested. **Built once, measured forever** — re-run by an institution each time a new ai-system ships (be it foreign or regional), re-run by an industry team after every change to the system being optimized.

The benchmark layer faces a **hard supply problem**: Benchmarks must be **authored from scratch**, by humans, and authoring one today requires four kinds of expertise that almost never sit in the same person: knowledge of what *correct* means in a domain (the domain expert), the ability to write a benchmark schema and scoring function (machine learning engineering), the theory and practice of generating a representative test (statistics), and the operational know-how to run the resulting artifact reliably (developer). The people whose judgment is most valuable to the region (i.e. domain experts) are locked out by the other three. This is the **Access Problem**, and it is the binding constraint on regional benchmark supply.

We root for a **multipolar AI world** — one in which AI is developed across many regions, by many communities, reflecting many sets of values — and we believe Latin America should be one of those poles, with its own technology and its own agency. From that position, an Evals Hub like LatamBoard must be **open by design** and **incentive-driven by construction**. Contributors — universities, public institutions, professional communities, and companies willing to open-source internal benchmarks — are recognized as contributors of the region's evaluation layer, driving brand-awareness on a heavy topic, and in turn can benefit from the benchmarks contributed by other organizations.

Many questions remain open. **Methodological standards** for a regional evaluation layer. **Re-evaluation cadence** — how often a benchmark should be re-run as new models ship, who maintains the artifact, who pays for the compute, and others — have no shared answer. **Sensitive-domain governance** for benchmnarks in domains like medical and legal requires institutional structures that do not yet exist regionally.

---

## §1 — The missing benchmark layer

### §1.1 — Frame

Latin America is missing a foundational layer for native AI development — the benchmark layer.

### §1.2 — Public-institution side of the absence

On the public-institution side, almost every AI system in regional use today was built elsewhere, and almost none of it has been measured against the contexts it is being deployed into. In practice, AI procured by public-institutions arrives as a foreign-built artifact and cannot be determined if it is appropriate for the desired use and if has the right value-system. In the absence of a regionally grounded benchmark layer, institutions default to vendor claims and have no instrument to evaluate the AI they consume [Metaxa et al. (2021)].

### §1.3 — Industry side of the absence

On the industry side, modern AI optimization — the software 3.0 stack of prompt-program optimizers and workflow-architecture search — consumes a benchmark as its input; no benchmark means no optimization target. Software 3.0-stack optimizers take a benchmark and a system as inputs and search for prompt programs or workflow-architecture changes that produce a higher score against that benchmark. No benchmark means no target, the optimizer cannot run, and the general-purpose model remains at its out-of-box performance on tasks with a relevant regional context. For example, a pest-classification model trained on European or North American agricultural imagery will not reliably identify the species affecting a Colombian coffee crop. The model appears to work and returns plausible output, but without a benchmark the miscalls remain invisible on exactly the tasks the regional economy needs AI to perform best.

### §1.4 — The dual cost

The cost of this missing layer is dual: a loss of auditability on one side, a loss of optimization direction on the other, and together a loss of industrial productivity and sovereign capacity over increasingly critical infrastructure. In practical terms, the region cannot audit what it consumes and cannot direct what it builds, cutting off both hands from a technology that is increasingly critical infrastructure. The next section names what the benchmark layer does to close both gaps — the audit function on the public-institution side and the optimization target on the industry side.

---

## §2 — What the benchmark layer does: audit and direction

### §2.1 — Frame

The benchmark layer does two things no other layer can.

### §2.2 — Function one: the audit function

On the public-institution side, benchmarks reveal whether a foreign or regional AI model acts correctly in a given context. The audit function is the principal lever public institutions have for understanding and governing AI they did not build [Liu et al. (2022)]. A benchmark measures behavior on the tasks and contexts (domains and languages) that matter, and produces a score that public institutions can feed into procurement, policy, and oversight decisions. This can position public institutions as independent auditors of AI systems worldwide, the same way some universities independently measure poverty or inequality [Mökander et al. (2023)].

### §2.3 — Function two: the optimization function

On the industry side, software 3.0-stack optimizers (e.g., DSPy [Khattab et al. (2023)] with MIPRO/GEPA-style prompt search [Opsahl-Ong et al. (2024); Agrawal et al. (2025)]) take a benchmark and output a more performing and/or aligned AI system, allowing a general-purpose model to be brought to state-of-the-art performance on a regional task through prompt, workflow-architecture, and inference-parameter changes — with no retraining and no inference-infrastructure change. Concretely, an optimizer is a program that consumes the benchmark and a starting AI system and searches for prompt-program, workflow-architecture, and inference-parameter changes that produce a higher score — with no model-parameter retraining and no change to the inference infrastructure. This is how an AI team at a company brings a general-purpose model, foreign or regional, to state-of-the-art performance on the specific task and context they care about, without training and owning a foundation model [Bommasani et al. (2021)].

### §2.4 — One artifact, two consumers, two functions

One artifact, two consumers, two functions — a public good for institutions and an optimization compass for industry. For institutions, benchmarks published openly can be run by any organization; the audit function scales because the artifact is shared, not rebuilt per body. For industry, a team pulls the same benchmark as the optimization target for a private production system and re-runs it after every change for continuous performance tracking. The same artifact serves both consumers — one authoring effort, two consumption paths, no duplication — which is what makes the benchmark layer shared infrastructure rather than N independent evaluations.

---

## §3 — An EvalsHub and LatamBoard: a proposed solution

### §3.1 — Proposal and instance

We propose a regional EvalsHub, with LatamBoard ([latamboard.ai](https://latamboard.ai)) as the first instance — the Latin American surface where benchmarks built by and for the region are published, runnable, and comparable across AI systems. It is the common web surface where regional benchmarks are published, indexed, and their results compared across AI models (e.g. DeepSeek vs GPT vs LatamGPT [LatamGPT Project (2025)]). Every benchmark on the hub is published under an open license, runnable end-to-end with reproducible execution, and comparable via a standardized evaluation protocol so scores carry across AI system, be it a model, node, workflow or agent.

### §3.2 — Task-first ontology

`/<task?>/<domain?>/<language?>` names a task-first ontology: task first because a benchmark is an exam for something; domain second because task context matters; language third as a modifier, with each level modifying the last. A benchmark is an exam, and every exam is for a specific capability — e.g., extraction, classification, summarization, transcription, translation, reasoning, etc. Domain sits second because "correct" depends on context — medical classification ≠ legal classification ≠ finance classification. Language sits third because regional language varieties matter — Chilean Spanish differs from Colombian Spanish [Gonçalves & Sánchez (2015)]. Each level compounds the last so the artifact at, for example, `/extract/medical/es-CL` is precise about all three axes.

### §3.3 — AI-system agnostic

The approach is AI-system agnostic: the benchmark defines what is being tested, while the AI target (model, node, workflow, agent) defines who is being tested. What stays fixed is the exam itself — the task definition, inputs, reference answers, and scoring function. What varies is the AI system under test — e.g., a single model call, a node inside a workflow, a full workflow, or an agent that orchestrates multiple steps. This matters because modern AI in production is compound, and a legal-document summarization model trained primarily on US case law may miss the procedural structure of an Argentine civil filing unless the benchmark measures the system actually deployed, not just an isolated model.

### §3.4 — Built once, measured forever

Every benchmark can be built once, and measured forever — that is, re-run by an organization each time a new AI model is created (foreign or regional), and re-run by an industry team after every change to the system being optimized (for continuous performance tracking). On the institutional side, every time a new model or version is created, re-running the same benchmark compounds the artifact's value as scores accumulate across systems and time, and it makes otherwise plausible outputs legible as shifts rather than silent failures. On the industry side, each workflow or prompt change is followed by a re-run on the same benchmark to get the new score — this is continuous performance tracking and is what a proper optimization target enables. Authoring is one-time while evaluation is forever, which is what makes a benchmark a piece of infrastructure rather than a project. An open question is how to guard against benchmark data contamination as models increasingly train on web-scale corpora that may include benchmark data [Xu et al. (2024)].

---

## §4 — The Access Problem: the binding constraint on regional benchmark supply

### §4.1 — Frame

The benchmark layer faces a hard supply problem — benchmarks must be authored from scratch, by humans. Datasets can be compiled from records that already exist (e.g., transactions, logs, corpora, publications), but a benchmark is an exam that must be designed and written. It encodes a claim about what *correct* looks like for a task in a given domain, and only a domain authority can make that claim.

### §4.2 — The four expertises required

Authoring a single benchmark today requires four kinds of expertise that almost never sit in the same person: knowledge of what *correct* means in a domain (the domain expert), the ability to write a benchmark schema and scoring function (machine learning engineering), the theory and practice of generating a representative test (statistics), and the operational know-how to run the resulting artifact reliably (developer). A physician (or historian, agronomist, lawyer) knows what *correct* means in their domain; an ML engineer knows how to encode that judgment as a schema and scoring function; a statistician knows how to draw a representative test; a developer knows how to ship the artifact so it runs reliably. A benchmark for medical named-entity recognition in Mexican health records, for example, needs a practicing clinician's ground truth [Schneider et al. (2020)], an ML engineer's encoding of the test schema and its scoring function, a statistician's benchmark data distribution, and a developer's packaging and run automation. Only a very small fraction of professionals have these 4 kinds of expertise, and thus a very small percentage of people can author a benchmark end-to-end.

### §4.3 — The Access Problem

The people whose judgment is most valuable to the region — domain experts — are locked out by the other three, a situation we call the Access Problem and the binding constraint on regional benchmark supply [Kay et al. (2024)]. Their judgment is the most valuable because they carry the substantive claim about what *correct* looks like for the regional task; without that claim a benchmark can be technically well-formed yet epistemically empty. The other three expertises — ML engineering, statistics, and developer operations — are the price of entry, and when domain experts lack them their judgment does not reach the artifact. The consequence is structural: no amount of money, compute, or attention poured into the other three unlocks supply if domain experts remain locked out, so for EvalsHub to reach scale, it must be paired with a technology that lowers the ML-engineering, statistics, and developer-operations barrier of entry so domain experts can author benchmarks directly. This is still an open problem. 

---

## §5 — A Multipolar position: Open by design, incentive-driven by construction

### §5.1 — Stance

We prefer a multipolar AI world — many regions, many communities, many value systems — and Latin America should be one of those poles, with its own technology and its own agency. The alternative is a unipolar/bipolar world in which the values, examples, tasks, and priorities of one or two regions dominate by default, with most widely used AI models and benchmarks originating there. Owning technology and agency means, at minimum, being able to steer imported models toward regional-context aware tasks and to audit them against regional standards. The development of sovereign foundation AI models is much more desirable [Roberts (2024)], and none of these two can be acheived without a benchmark layer.


### §5.2 — Design consequence

From that position, an EvalsHub like LatamBoard must be open by design — to foster the collaboration and innovation the region needs to reach the AI frontier — and incentive-driven by construction — to keep the evaluation layer as public infrastructure sustained continuously by the broader community, rather than a single team's project. Open by design means open licensing of the benchmark artifact, open source of the scoring code, and open access to the results (e.g., leaderboards visible), or the layer walls off collaboration and cannot compound with the region's community effort. Incentive-driven by construction means contribution rewards the contributor in a meaningful way (e.g. recognition, brand visibility) so as to keep a reinforcing loop.

### §5.3 — Contributor recognition and reciprocity

Contributor recognition and reciprocity are explicit: universities, public institutions, professional communities, and companies willing to open-source internal benchmarks are named as contributors to the region's evaluation layer, gain brand awareness on a heavy topic, and also indirectly benefit from benchmarks contributed by other organizations that are now more incentiviced to contribute as well. Universities gain institutional visibility on a heavy topic, public institutions gain soft-power positioning, professional communities gain a shared instrument for the field, and companies willing to open-source internal benchmarks gain a an understanding of the best performing AI systems worldwide for the tasks and context they care about.

---

## §6 — Open questions

### §6.1 — Frame

Many questions remain open.

### §6.2 — Methodological standards & Logistics

Methodological standards for a regional evaluation layer need to be defined and shared. Shared standards must cover how to design a benchmark schema, how build statistically representative benchmark data, how to score it (e.g., deterministic metrics, LLM-as-judge [Zheng et al. (2023)], or human raters), and how to version and update the artifact as understanding of the task evolves [Pineau et al. (2020)]. This article does not attempt to close these questions — it opens them for the region's community to converge on.

How often a benchmark should be re-run as new models ship, who maintains the artifacts, who pays for the compute, etc. — has no shared answer yet. 

### §6.3 — Sensitive-domain governance

Sensitive-domain governance for benchmarks in domains like healthcare requires institutional structures that do not yet exist regionally. In these domains, a benchmark must carry the authority of the profession to shape procurement and practice. Regionally, the institutions that could confer that authority  have not yet organized around this role.

---

## §7 — An invitation to contribute

The benchmark layer only exists to the extent that the region's community builds it. LatamBoard is a starting point — the surface, the ontology, and the first regional benchmarks — but the layer itself is what universities, public institutions, professional communities, and companies choose to contribute over time.

We invite each of these stakeholders directly. Universities and research groups can publish the benchmarks they already build in the course of their research. Public institutions can contribute the evaluations they run — or want to run — on the AI they procure and oversee. Professional communities can claim authorship over the benchmarks that define correctness for their domain. Companies willing to open-source internal evaluations can turn private measurement work into public infrastructure, and gain a comparable view of AI performance across the tasks they care about.

The ambition of LatamBoard is to become common infrastructure for AI development in the region — built by the region, for the region. Every added benchmark makes the layer more valuable to every other participant, and every stakeholder that joins compounds the incentive for the next. Come find us at [latamboard.ai](https://latamboard.ai).

## References

- Khattab, O., et al. (2023). DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines. arXiv:2310.03714.
- Opsahl-Ong, K., et al. (2024). Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs. EMNLP 2024. arXiv:2406.11695.
- Agrawal, L.A., et al. (2025). GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. ICLR 2026 (Oral). arXiv:2507.19457.
- LatamGPT Project (2025). LatamGPT: Open LLMs for Latin American Spanish.
- Bommasani, R., et al. (2021). On the Opportunities and Risks of Foundation Models. arXiv:2108.07258.
- Liu, X., et al. (2022). The medical algorithmic audit. The Lancet Digital Health, 4(3), e152-e163. DOI: 10.1016/S2589-7500(22)00003-6.
- Mökander, J., et al. (2023). Auditing large language models: a three-layered approach. AI and Ethics. DOI: 10.1007/s43681-023-00289-2.
- Kay, J., et al. (2024). Epistemic Injustice in Generative AI. AIES 2024. DOI: 10.1609/aies.v7i1.31671.
- Schneider, E.T.R., et al. (2020). BioBERTpt: A Portuguese Neural Language Model for Clinical Named Entity Recognition. Clinical NLP Workshop, ACL 2020. DOI: 10.18653/v1/2020.clinicalnlp-1.7.
- Pineau, J., et al. (2020). Improving Reproducibility in Machine Learning Research (A Report from the NeurIPS 2019 Reproducibility Program). JMLR. arXiv:2003.12206.
- Metaxa, D., Park, J.S., Robertson, R.E. (2021). Auditing Algorithms: Understanding Algorithmic Systems from the Outside In. Foundations and Trends in HCI. DOI: 10.1561/1100000083.
- Xu, C., et al. (2024). Benchmark Data Contamination of Large Language Models: A Survey. arXiv:2406.04244.
- Zheng, L., et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. NeurIPS 2023. arXiv:2306.05685.
- Roberts, H. (2024). Digital sovereignty and artificial intelligence: a normative approach. AI and Ethics. DOI: 10.1007/s10676-024-09810-5.
- Gonçalves, B., Sánchez, D. (2015). Learning about Spanish dialects through Twitter. arXiv:1511.04970.

