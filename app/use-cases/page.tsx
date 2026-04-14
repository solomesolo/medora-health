'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Difficulty = 'High' | 'Medium' | 'Medium to high'

type UseCase = {
  id: string
  metaLeft: string
  difficulty: Difficulty
  title: string
  shortDescription: string
  timeframe: string
  cost: string
  sections: {
    description: string
    whyInteresting: string
    timeframeDetail: string
    involvedParties: string
    whatWasDoneLead?: string
    whatWasDone: string
    costs: string
    results: string
    learning: string
  }
}

function difficultyDots(level: Difficulty) {
  const filled = level === 'High' ? 3 : level === 'Medium' ? 2 : 3
  const label = level === 'Medium to high' ? 'Medium to high' : level
  return { filled, label }
}

function CaseCard({
  item,
  isOpen,
  onToggle,
}: {
  item: UseCase
  isOpen: boolean
  onToggle: () => void
}) {
  const detailsRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    if (!isOpen) {
      setMaxHeight(0)
      return
    }
    const next = el.scrollHeight
    setMaxHeight(next)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const el = detailsRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setMaxHeight(el.scrollHeight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [isOpen])

  const dots = difficultyDots(item.difficulty)

  const handleToggle = () => {
    onToggle()
    requestAnimationFrame(() => {
      const card = document.getElementById(item.id)
      if (!card) return
      const top = card.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top, behavior: 'smooth' })
    })
  }

  return (
    <article
      id={item.id}
      className={`use-cases-card ${isOpen ? 'is-open' : ''}`}
      aria-expanded={isOpen}
    >
      <button className="use-cases-card__header" type="button" onClick={handleToggle}>
        <div className="use-cases-card__meta">
          <span className="use-cases-card__metaLeft">{item.metaLeft}</span>
          <span className="use-cases-card__tag">{dots.label} difficulty</span>
        </div>
        <h2 className="use-cases-card__title">{item.title}</h2>
        <p className="use-cases-card__desc">{item.shortDescription}</p>
        <div className="use-cases-card__bottom">
          <div className="use-cases-card__bottomLeft">
            <span>Timeframe: {item.timeframe}</span>
            <span>Cost: {item.cost}</span>
          </div>
          <span className="use-cases-card__cta">
            {isOpen ? 'Close case ↑' : 'View case →'}
          </span>
        </div>
      </button>

      <div
        className="use-cases-card__detailsWrap"
        style={{ maxHeight: isOpen ? maxHeight : 0 }}
        aria-hidden={!isOpen}
      >
        <div ref={detailsRef} className="use-cases-card__details">
          <div className="use-cases-section">
            <div className="use-cases-section__label">Description</div>
            <p className="use-cases-section__body">{item.sections.description}</p>
          </div>

          <div className="use-cases-section">
            <div className="use-cases-section__label">Why this case was interesting</div>
            <p className="use-cases-section__body">{item.sections.whyInteresting}</p>
          </div>

          <div className="use-cases-section">
            <div className="use-cases-section__label">Level of difficulty</div>
            <div className="use-cases-difficulty">
              <div className="use-cases-difficulty__dots" aria-label={`${dots.label} difficulty`}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`use-cases-dot ${i < dots.filled ? 'is-on' : ''}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="use-cases-difficulty__text">{dots.label}</div>
            </div>
          </div>

          <div className="use-cases-section">
            <div className="use-cases-section__label">Timeframe</div>
            <p className="use-cases-section__body">{item.sections.timeframeDetail}</p>
          </div>

          <div className="use-cases-section">
            <div className="use-cases-section__label">Involved parties</div>
            <p className="use-cases-section__body">{item.sections.involvedParties}</p>
          </div>

          <div className="use-cases-section">
            <div className="use-cases-section__label">What was done</div>
            {item.sections.whatWasDoneLead ? (
              <p className="use-cases-section__lead">{item.sections.whatWasDoneLead}</p>
            ) : null}
            <p className="use-cases-section__body use-cases-section__body--long">
              {item.sections.whatWasDone}
            </p>
          </div>

          <div className="use-cases-section use-cases-section--cost">
            <div className="use-cases-section__label">Costs</div>
            <div className="use-cases-costBlock">
              <div className="use-cases-costBlock__k">Investment</div>
              <div className="use-cases-costBlock__v">{item.sections.costs}</div>
            </div>
          </div>

          <div className="use-cases-section use-cases-section--results">
            <div className="use-cases-section__label">Results</div>
            <div className="use-cases-results">
              <p className="use-cases-results__body">{item.sections.results}</p>
            </div>
          </div>

          <div className="use-cases-section use-cases-section--learning">
            <div className="use-cases-section__label">Learning for others</div>
            <p className="use-cases-learning">{item.sections.learning}</p>
          </div>

          <button className="use-cases-closeLink" type="button" onClick={handleToggle}>
            Close case ↑
          </button>
        </div>
      </div>
    </article>
  )
}

export default function UseCasesPage() {
  const cases: UseCase[] = useMemo(
    () => [
      {
        id: 'use-case-1',
        metaLeft: 'Poland · AI Diagnostics',
        difficulty: 'High',
        title: 'AI Diagnostics Platform Entering Germany',
        shortDescription:
          'A clinically validated AI diagnostics product with strong hospital traction faced repeated breakdowns in German provider discussions due to workflow and positioning mismatch.',
        timeframe: '5 weeks',
        cost: '€12,000',
        sections: {
          description:
            'A Poland-based AI diagnostics company with established deployments in Eastern European hospitals approached Medora with the intention to expand into Germany. The product demonstrated strong clinical performance and was already integrated into hospital radiology workflows. The leadership team assumed that this traction would translate into rapid adoption in Germany.',
          whyInteresting:
            'The product itself was technically strong and clinically validated, yet early conversations with German providers repeatedly stalled. This created a clear example of a situation where success in one system created false confidence when entering a structurally different one.',
          timeframeDetail:
            'From first conversation to first tangible results: five weeks. This included initial diagnosis, product adaptation definition, and re-engagement with target providers.',
          involvedParties:
            'Founder and CEO, Head of Product, clinical advisor from the company side. On the Medora side, direct involvement at principal level with targeted input from regulatory and clinical workflow specialists when required.',
          whatWasDoneLead:
            'The work began with a structured diagnosis of where the product failed to align with German diagnostic workflows.',
          whatWasDone:
            'This included reviewing how radiology decisions are made in Praxis and MVZ environments compared to hospital settings. The value proposition was then redefined to reflect how German providers evaluate efficiency and clinical benefit. Product gaps were identified, not at the level of core technology, but at the level of usability, integration expectations, and reporting structure. A revised entry strategy was developed, focusing on specific provider segments rather than broad hospital outreach.',
          costs: '€12,000 for the full engagement.',
          results:
            'The company repositioned its product toward outpatient diagnostic providers and adjusted its narrative accordingly. Conversations with German providers shifted from exploratory to concrete pilot discussions. The risk of a failed market entry due to misalignment was significantly reduced.',
          learning:
            'Strong clinical performance does not compensate for structural mismatch. In Germany, where diagnostics are heavily decentralized, success depends on fitting into the operational reality of outpatient providers rather than replicating hospital-based models.',
        },
      },
      {
        id: 'use-case-2',
        metaLeft: 'Romania · Digital Therapeutics',
        difficulty: 'Medium to high',
        title: 'Digital Therapeutics Company Preparing for DiGA',
        shortDescription:
          'A digital therapeutics product with clinical backing aimed for DiGA but faced hidden readiness gaps across evidence, patient flows, and positioning.',
        timeframe: '6 weeks',
        cost: '€18,000',
        sections: {
          description:
            'A Romanian digital therapeutics company aimed to enter the German market through the DiGA reimbursement pathway. The product had clinical backing and demonstrated patient engagement in its home market, but the team lacked experience with German regulatory and reimbursement expectations.',
          whyInteresting:
            'The company approached Germany with a clear strategy, but underestimated how specific and demanding the DiGA pathway is. This created a situation where the product appeared ready on the surface, while critical gaps existed beneath.',
          timeframeDetail:
            'Six weeks from initial assessment to a structured DiGA readiness roadmap with defined next steps.',
          involvedParties:
            'CEO, Chief Medical Officer, Head of Product. External clinical advisors were involved on the client side. Medora worked directly with leadership and product teams, with additional input on regulatory interpretation where necessary.',
          whatWasDoneLead:
            'The engagement started with a detailed assessment of the product against DiGA requirements.',
          whatWasDone:
            'This included clinical evidence, usability, and data handling. Gaps were identified in both the evidence structure and patient interaction design. The onboarding and engagement flows were reworked to better match expectations of German patients and evaluators. Positioning was refined to differentiate the product from existing DiGA solutions, with a clear articulation of its clinical and economic value.',
          costs: '€18,000 for the engagement.',
          results:
            'The company gained a clear and realistic pathway toward DiGA application. Product adjustments improved alignment with both patient expectations and regulatory standards. Internal clarity increased significantly, reducing uncertainty around investment into the German market.',
          learning:
            'Entering Germany through DiGA is not only a regulatory process, but a product and evidence challenge. Without aligning all three, companies risk investing heavily into a pathway they are not prepared to complete.',
        },
      },
      {
        id: 'use-case-3',
        metaLeft: 'Estonia · Remote Care',
        difficulty: 'Medium',
        title: 'Remote Care Platform Achieving First German Traction',
        shortDescription:
          'A remote care platform with success in Nordic markets needed a reset in targeting and narrative to secure its first German pilot.',
        timeframe: '5 weeks',
        cost: '€15,000',
        sections: {
          description:
            'An Estonian remote care platform with strong traction in Nordic markets aimed to expand into Germany. The product was designed around a centralized care model and assumed similar adoption dynamics in the German system.',
          whyInteresting:
            'The company had already succeeded in multiple markets and approached Germany with confidence. The case illustrates how prior success can obscure structural differences and delay recognition of fundamental misalignment.',
          timeframeDetail:
            'Five weeks from initial conversation to securing the first pilot agreement with a German provider.',
          involvedParties:
            'CEO, Head of Growth, Product Lead. On the Medora side, direct involvement with strategic and product adaptation work, supported by targeted input on provider landscape.',
          whatWasDoneLead:
            'The initial phase focused on identifying why the existing value proposition did not resonate with German stakeholders.',
          whatWasDone:
            'The product was reframed to address specific pain points within fragmented care delivery. Target segments were narrowed down to those most likely to adopt early. A structured pilot strategy was developed, including partner identification and engagement approach. Messaging was adapted to reflect how German providers evaluate new solutions.',
          costs: '€15,000 for the engagement.',
          results:
            'The company secured its first pilot with a German provider and established a clear pathway for expansion. Conversations with potential partners became more focused and productive. The market entry moved from theoretical to operational.',
          learning:
            'Success in other European markets does not guarantee transferability to Germany. The fragmented nature of the system requires precise targeting and positioning from the very beginning.',
        },
      },
    ],
    [],
  )

  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    document.body.setAttribute('data-page', 'use-cases')
    return () => document.body.removeAttribute('data-page')
  }, [])

  return (
    <main className="use-cases-page" aria-label="Use cases">
      <header className="use-cases-header">
        <div className="use-cases-header__inner">
          <p className="use-cases-eyebrow">Case Work</p>
          <h1 className="use-cases-title">Case Work</h1>
          <p className="use-cases-sub">
            Selected engagements on market entry and product adaptation in the German healthcare
            system.
          </p>
        </div>
      </header>

      <section className="use-cases-list" aria-label="Use case list">
        {cases.map((item) => (
          <CaseCard
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
          />
        ))}
      </section>
    </main>
  )
}

