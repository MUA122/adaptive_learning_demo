import React, { useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Braces, Check, CheckCircle2, ChevronRight, Compass, Flag, GitBranch, Layers3, LockKeyhole, LocateFixed, Repeat2, Route, Sparkles, Trophy } from 'lucide-react';
import { buildSkillPath } from '../skill-path';
import './skill-map.css';

const icons = { variables: Braces, loops: Repeat2, functions: BookOpen, callstack: Layers3, recursion: Route, trees: GitBranch };
const descriptions = {
  variables: ['Give your ideas a place to live. Store, name, and transform the values that power every program.', 'ابدأ بأفكارك: تعلّم تخزين القيم وتسميتها وتغييرها لبناء أي برنامج.'],
  loops: ['Make a little code go a long way. Repeat actions and turn patterns into efficient programs.', 'اكتب كودًا أقل ينجز أكثر. كرر الأوامر وحوّل الأنماط إلى برامج فعالة.'],
  functions: ['Build once, use everywhere. Turn your logic into small, reusable building blocks.', 'اكتب مرة واستخدم مرات. حوّل أفكارك إلى دوال صغيرة قابلة لإعادة الاستخدام.'],
  callstack: ['Look beneath the surface. Follow function calls and see how your program really runs.', 'اكتشف ما وراء الكود. تتبع استدعاءات الدوال وافهم كيف يعمل برنامجك.'],
  recursion: ['Think in smaller steps. Solve elegant problems with functions that call themselves.', 'فكّر في خطوات أصغر. حل المشكلات باستخدام دوال تستدعي نفسها.'],
  trees: ['Bring it all together. Explore connected data and navigate a world of branches and possibilities.', 'اجمع كل ما تعلمته. استكشف البيانات المترابطة وعالم الفروع والاحتمالات.'],
};

function collectAncestors(id, nodes, result = new Set()) {
  const node = nodes.find(item => item.id === id);
  node.requires.forEach(parent => {
    if (!result.has(parent)) {
      result.add(parent);
      collectAncestors(parent, nodes, result);
    }
  });
  return result;
}

export default function SkillMap({ concepts, mastery, lessonDone, lang = 'en', diagnosed = false, onOpen, onDashboard }) {
  const ar = lang === 'ar';
  const copy = (en, arabic) => ar ? arabic : en;
  const name = node => ar ? node.ar : node.en;
  const { nodes, next, completed, level } = buildSkillPath(concepts, mastery, lessonDone);
  const [selectedId, setSelectedId] = useState(next.id);
  const detailRef = useRef(null);
  const selected = nodes.find(node => node.id === selectedId) || next;
  const ancestors = collectAncestors(selected.id, nodes);
  const missing = selected.requires.map(id => nodes.find(node => node.id === id)).filter(node => node.state !== 'complete');
  // A locked preview always offers the earliest available prerequisite, including indirect ones.
  const prerequisite = nodes.find(node => ancestors.has(node.id) && node.state === 'available') || next;
  const SelectedIcon = icons[selected.id];
  const Forward = ar ? ArrowLeft : ArrowRight;
  const gradientId = useId().replace(/:/g, '');
  const status = state => state === 'complete' ? copy('Completed', 'مكتمل') : state === 'available' ? copy('Ready to explore', 'جاهز للتعلم') : copy('Locked', 'مغلق');

  return <section className="skill-map" aria-label={copy('Your personalized skill map', 'خريطة مهاراتك الشخصية')}>
    <header className="skill-map-header">
      <div>
        <div className="skill-map-eyebrow"><span />{copy('YOUR LEARNING ATLAS', 'أطلس رحلتك التعليمية')}</div>
        <h1>{copy('Big possibilities.', 'إمكانيات كبيرة.')} <span>{copy('One skill at a time.', 'مهارة بخطوة.')}</span></h1>
        <p>{diagnosed ? copy('A path shaped by what you know. Discover where you can go next.', 'مسار مبني على ما تعرفه. اكتشف خطوتك القادمة.') : copy('Every great programmer starts somewhere. This is your beginning.', 'كل مبرمج عظيم بدأ بخطوة. هنا تبدأ رحلتك.')}</p>
      </div>
      {onDashboard && <button className="atlas-dashboard" onClick={onDashboard}>{copy('Go to dashboard', 'لوحة التعلم')}<Forward size={16} /></button>}
    </header>

    <div className="atlas-overview">
      <span className="atlas-course-icon"><Compass size={24} /></span>
      <div className="atlas-course"><small>{copy('YOUR COURSE', 'مقررك الدراسي')}</small><strong>{copy('Introduction to Programming', 'مقدمة في البرمجة')}</strong></div>
      <div className="atlas-placement"><Sparkles size={14} /><span>{diagnosed ? copy('Personalized path', 'مسار مخصص') : copy('Beginner path', 'مسار المبتدئين')}<b>{copy(`Level ${level}`, `المستوى ${level}`)}</b></span></div>
      <div className="atlas-progress"><span><b>{completed} / 6</b> {copy('skills completed', 'مهارات مكتملة')}</span><div role="progressbar" aria-label={copy('Course progress', 'تقدم المقرر')} aria-valuenow={completed} aria-valuemin={0} aria-valuemax={6}><i style={{ width: `${completed / 6 * 100}%` }} /></div></div>
    </div>

    <div className="atlas-layout">
      <div className="atlas-canvas">
        <div className="atlas-canvas-top"><span><GitBranch size={15} />{copy('THE LEARNING TREE', 'شجرة التعلم')}</span><button onClick={() => setSelectedId(next.id)}><LocateFixed size={15} />{copy('My next step', 'خطوتي القادمة')}</button></div>
        <div className="atlas-legend">{['complete', 'available', 'locked'].map(state => <span key={state}><i className={state} />{status(state)}</span>)}</div>
        <div className="atlas-tree" role="group" aria-label={copy('Select a skill to explore its prerequisites and lessons', 'اختر مهارة لاستكشاف متطلباتها ودروسها')}>
          <div className="atlas-phase phase-foundation"><span>01</span><b>{copy('PLANT THE SEED', 'ازرع البداية')}</b></div>
          <div className="atlas-phase phase-build"><span>02</span><b>{copy('GROW YOUR LOGIC', 'طوّر منطقك')}</b></div>
          <div className="atlas-phase phase-connect"><span>03</span><b>{copy('CONNECT THE DOTS', 'اربط الأفكار')}</b></div>
          <svg className="atlas-connections" viewBox="0 0 600 965" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="965"><stop stopColor="#af9bff" /><stop offset="1" stopColor="#7960e9" /></linearGradient></defs>
            {nodes.flatMap(node => node.requires.map(parentId => {
              const parent = nodes.find(item => item.id === parentId);
              const x1 = parent.x * 6, x2 = node.x * 6, y1 = parent.y + 98, y2 = node.y - 46;
              const curve = Math.min(75, (y2 - y1) / 2);
              const d = `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;
              const highlighted = ancestors.has(parentId) && (ancestors.has(node.id) || selected.id === node.id);
              return <g key={`${parentId}-${node.id}`} className={`atlas-edge ${parent.state === 'complete' ? 'complete' : ''} ${highlighted ? 'highlighted' : ''}`}>
                <path className="atlas-edge-base" d={d} />
                {highlighted && <path className="atlas-edge-highlight" d={d} stroke={`url(#${gradientId})`} />}
                {node.id === next.id && parent.state === 'complete' && <path className="atlas-edge-travel" d={d} />}
              </g>;
            }))}
          </svg>
          {nodes.map((node, index) => {
            const Icon = icons[node.id];
            const recommended = node.id === next.id && node.state !== 'complete';
            return <button key={node.id} className={`atlas-node ${node.state} ${selected.id === node.id ? 'selected' : ''} ${recommended ? 'recommended' : ''}`} style={{ left: `${node.x}%`, top: node.y, '--node-delay': `${index * 65}ms` }} aria-label={`${name(node)} · ${status(node.state)}${recommended ? copy(' · Recommended next', ' · الخطوة المقترحة') : ''}`} aria-pressed={selected.id === node.id} onClick={() => setSelectedId(node.id)}>
              {recommended && <span className="atlas-you-are-here"><Sparkles size={10} />{copy('YOUR NEXT STEP', 'خطوتك القادمة')}</span>}
              <span className="atlas-node-orbit" />
              <span className="atlas-node-core"><Icon size={29} strokeWidth={1.65} /><span className="atlas-node-badge">{node.state === 'complete' ? <Check size={11} /> : node.state === 'locked' ? <LockKeyhole size={10} /> : <PlayGlyph />}</span></span>
              <span className="atlas-node-name">{name(node)}</span>
              <span className="atlas-node-meta">{node.state === 'complete' ? <><Check size={10} />{status(node.state)}</> : node.state === 'locked' ? <><LockKeyhole size={10} />{copy(`Level ${node.level}`, `المستوى ${node.level}`)}</> : copy('3 lessons · Let’s begin', '٣ دروس · لنبدأ')}</span>
            </button>;
          })}
          <div className="atlas-finish"><Flag size={13} /><span>{copy('A whole new way of thinking awaits', 'طريقة جديدة للتفكير في انتظارك')}</span></div>
        </div>
        <div className="atlas-canvas-footer"><span><span className="atlas-live-dot" />{copy('Your path grows with you', 'مسارك ينمو معك')}</span><small>{copy('Select any skill to explore', 'اختر أي مهارة لاستكشافها')}</small></div>
      </div>

      <button className="atlas-mobile-preview" onClick={() => detailRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}>
        <span><b>{name(selected)}</b><small>{status(selected.state)}</small></span><span>{copy('Explore skill', 'استكشف المهارة')}<Forward size={16} /></span>
      </button>

      <aside className="atlas-inspector" aria-label={copy('Selected skill details', 'تفاصيل المهارة المختارة')}>
        <div className="atlas-detail" key={selected.id} ref={detailRef}>
          <div className="atlas-detail-top"><span className={`atlas-detail-state ${selected.state}`}>{selected.state === 'locked' ? <LockKeyhole size={12} /> : <Sparkles size={12} />}{selected.id === next.id && selected.state !== 'complete' ? copy('RECOMMENDED FOR YOU', 'مقترح لك') : status(selected.state)}</span><span>0{nodes.indexOf(selected) + 1} / 06</span></div>
          <div className={`atlas-detail-icon ${selected.state}`}><SelectedIcon size={33} strokeWidth={1.5} /></div>
          <span className="atlas-detail-level">{copy(`LEVEL ${selected.level} · PROGRAMMING`, `المستوى ${selected.level} · البرمجة`)}</span>
          <h2>{name(selected)}</h2>
          <p>{descriptions[selected.id][ar ? 1 : 0]}</p>
          <div className="atlas-lesson-info"><BookOpen size={15} />{copy('3 guided lessons', '٣ دروس تفاعلية')}<span>{copy('Learn at your pace', 'تعلّم على راحتك')}</span></div>
          {selected.lessonsExplored > 0 && <div className="atlas-explored"><CheckCircle2 size={14} />{copy(`${selected.lessonsExplored} of 3 lessons explored`, `تم استكشاف ${selected.lessonsExplored} من ٣ دروس`)}</div>}
          <div className="atlas-prerequisites"><h3>{copy('BEFORE THIS SKILL', 'قبل هذه المهارة')}</h3>{selected.requires.length ? selected.requires.map(id => {
            const parent = nodes.find(node => node.id === id);
            return <button key={id} onClick={() => setSelectedId(id)}><span className={parent.state === 'complete' ? 'met' : ''}>{parent.state === 'complete' ? <CheckCircle2 size={16} /> : <LockKeyhole size={15} />}</span>{name(parent)}<ChevronRight size={14} /></button>;
          }) : <div className="atlas-no-prerequisites"><CheckCircle2 size={16} />{copy('Just bring your curiosity.', 'كل ما تحتاجه هو فضولك.')}</div>}</div>
          {selected.state === 'locked' && <p className="atlas-unlock-copy">{copy(`Complete ${missing.map(node => node.en).join(' and ')} to unlock this skill.`, `أكمل ${missing.map(node => node.ar).join(' و')} لفتح هذه المهارة.`)}</p>}
          <button className="atlas-start" onClick={() => onOpen(selected.state === 'locked' ? prerequisite.id : selected.id)}>{selected.state === 'locked' ? copy(`Start with ${prerequisite.en}`, `ابدأ بـ${prerequisite.ar}`) : selected.state === 'complete' ? copy('Revisit this skill', 'راجع هذه المهارة') : selected.lessonsExplored ? copy('Continue learning', 'تابع التعلم') : copy('Let’s start learning', 'لنبدأ التعلم')}<Forward size={17} /></button>
          <span className="atlas-detail-footnote">{copy('Watch. Read. Play. Find your way.', 'شاهد. اقرأ. العب. اختر طريقتك.')}</span>
        </div>
        <div className="atlas-encouragement"><span><Trophy size={21} /></span><div><strong>{completed === 6 ? copy('Look how far you’ve come.', 'شوف وصلت لفين.') : copy('Progress, one discovery at a time.', 'تقدّم مع كل اكتشاف جديد.')} </strong><p>{copy('Every skill you build opens a new possibility. Your next chapter is waiting.', 'كل مهارة تتعلمها تفتح لك فرصة جديدة. خطوتك القادمة في انتظارك.')}</p></div></div>
        <div className="atlas-path-note"><GitBranch size={15} /><p>{copy('Follow the branches. Connected skills build on each other; complete the prerequisites to open the next step.', 'اتبع الفروع. المهارات المترابطة تبني على بعضها؛ أكمل المتطلبات لفتح خطوتك القادمة.')}</p></div>
        <p className="atlas-estimate">{copy('Illustrative course path. Diagnostic readiness and lesson progress shape your starting point.', 'مسار مقرر توضيحي. يتحدد مسارك حسب الاختبار وتقدمك في الدروس.')}</p>
      </aside>
    </div>
  </section>;
}

function PlayGlyph() {
  return <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 1.5 8 5 3 8.5Z" fill="currentColor" /></svg>;
}
