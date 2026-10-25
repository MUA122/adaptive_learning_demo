import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowLeft, ArrowRight, BrainCircuit, Check, GraduationCap, LockKeyhole, Network, Sparkles, Workflow, X } from 'lucide-react';
import './course-completion.css';

const courses = [
  { en: 'Introduction to Programming', ar: 'مقدمة في البرمجة', Icon: GraduationCap },
  { en: 'Machine Learning', ar: 'تعلم الآلة', Icon: Workflow },
  { en: 'Deep Learning', ar: 'التعلم العميق', Icon: BrainCircuit },
  { en: 'Neural Networks', ar: 'الشبكات العصبية', Icon: Network },
];

export function CourseRoadmap({ lang = 'en', passed = false }) {
  const ar = lang === 'ar';
  const Forward = ar ? ArrowLeft : ArrowRight;
  const Back = ar ? ArrowRight : ArrowLeft;
  return <ol className="course-roadmap" aria-label={ar ? 'مسار المقررات' : 'Course progression roadmap'}>
    {courses.map(({ en, ar: arabic, Icon }, index) => <li key={en} className={`course-roadmap-step course-step-${index} ${index === 0 ? 'current' : ''} ${index === 1 && passed ? 'next-unlocked' : ''}`}>
      <div className="course-roadmap-box"><span className="course-roadmap-icon"><Icon size={17} strokeWidth={1.7} /></span><span><small>{index === 0 ? (ar ? 'مقررك الحالي' : 'YOUR CURRENT COURSE') : index === 1 && passed ? (ar ? 'متاح الآن' : 'UNLOCKED NEXT') : (ar ? `المقرر ٠${index + 1}` : `UP NEXT · 0${index + 1}`)}</small><strong>{ar ? arabic : en}</strong></span>{index > 0 ? index === 1 && passed ? <Check className="course-roadmap-lock" size={11} /> : <LockKeyhole className="course-roadmap-lock" size={10} /> : <span className="course-current-dot" />}</div>
      {index < 3 && <span className="course-roadmap-connection" aria-hidden="true">{index === 1 ? <ArrowDown size={13} /> : index === 0 ? <Forward size={13} /> : <Back size={13} />}</span>}
    </li>)}
  </ol>;
}

export default function CourseCompletionNav({ lang, completion, passed, active, open, onOpenChange, onNavigate }) {
  const ar = lang === 'ar';
  const copy = (en, arabic) => ar ? arabic : en;
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const closeTimer = useRef(null);
  const pinned = useRef(false);
  const id = useId();
  const [position, setPosition] = useState(null);
  const locked = !completion.unlocked;
  const clearTimer = () => clearTimeout(closeTimer.current);
  const close = () => { clearTimer(); pinned.current = false; onOpenChange(false); };
  const scheduleClose = () => {
    clearTimer();
    if (!pinned.current) closeTimer.current = setTimeout(() => onOpenChange(false), 170);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => { if (!open) pinned.current = false; }, [open]);
  useLayoutEffect(() => {
    if (!open || !locked) return;
    const place = () => {
      const trigger = triggerRef.current.getBoundingClientRect();
      const width = Math.min(366, window.innerWidth - 32);
      const height = popoverRef.current?.offsetHeight || 390;
      const desiredLeft = ar ? trigger.left - width - 14 : trigger.right + 14;
      setPosition({
        width,
        left: Math.max(16, Math.min(desiredLeft, window.innerWidth - width - 16)),
        top: Math.max(16, Math.min(trigger.top - 30, window.innerHeight - Math.min(height, window.innerHeight - 32) - 16)),
      });
    };
    place();
    const observer = new ResizeObserver(place);
    if (popoverRef.current) observer.observe(popoverRef.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { observer.disconnect(); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, locked, ar]);

  useEffect(() => {
    if (!open) return;
    const outside = event => {
      if (!triggerRef.current?.contains(event.target) && !popoverRef.current?.contains(event.target)) close();
    };
    const escape = event => {
      if (event.key === 'Escape') { close(); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open, onOpenChange]);

  return <>
    <button ref={triggerRef} className={`nav-item course-completion-nav ${locked ? 'is-locked' : 'is-unlocked'} ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={copy(`Course completion${locked ? ' · Locked' : ''}`, `إتمام المقرر${locked ? ' · مغلق' : ''}`)} aria-expanded={locked ? open : undefined} aria-controls={locked && open ? id : undefined} aria-haspopup={locked ? 'dialog' : undefined}
      onPointerEnter={event => { if (locked && event.pointerType === 'mouse') { clearTimer(); onOpenChange(true); } }} onPointerLeave={scheduleClose}
      onClick={() => { if (!locked) { close(); onNavigate(); return; } clearTimer(); pinned.current = !pinned.current; onOpenChange(pinned.current); }}>
      <span className="completion-nav-icon">{locked ? <LockKeyhole size={18} /> : <GraduationCap size={19} />}</span>
      <span className="completion-nav-copy"><strong>{copy('Course completion', 'إتمام المقرر')}</strong><small>{locked ? copy('Your next milestone', 'إنجازك القادم') : passed ? copy('Course completed', 'تم إكمال المقرر') : copy('Final Assessment ready', 'التقييم النهائي متاح')}</small></span>
      <span className={`completion-nav-pill ${locked ? '' : 'ready'}`}>{locked ? <LockKeyhole size={10} /> : <Check size={11} />}</span>
    </button>
    {locked && open && createPortal(<div ref={popoverRef} id={id} role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} className={`completion-popover ${ar ? 'arabic' : ''}`} dir={ar ? 'rtl' : 'ltr'} style={{ ...position, visibility: position ? 'visible' : 'hidden' }} onPointerEnter={clearTimer} onPointerLeave={scheduleClose}>
      <button className="completion-popover-close" aria-label={copy('Close course roadmap', 'إغلاق مسار المقررات')} onClick={() => { close(); triggerRef.current?.focus(); }}><X size={15} /></button>
      <div className="completion-popover-heading"><span className="completion-popover-emblem"><LockKeyhole size={21} strokeWidth={1.6} /><i><Sparkles size={10} /></i></span><div><span>{copy('THE NEXT CHAPTER', 'الفصل القادم')}</span><h2 id={`${id}-title`}>{copy('Great things lie ahead.', 'إنجازات كبيرة في انتظارك.')}</h2></div></div>
      <p id={`${id}-description`}>{copy('Complete your entire learning path to unlock the Final Assessment. Pass the assessment to complete Introduction to Programming and unlock your next course: Machine Learning.', 'أكمل مسارك التعليمي بالكامل لفتح التقييم النهائي. اجتز التقييم لإتمام مقرر مقدمة في البرمجة وفتح مقررك التالي: تعلم الآلة.')}</p>
      <div className="completion-popover-progress"><span>{copy('YOUR PATH TO THE FINISH LINE', 'رحلتك نحو خط النهاية')}</span><b dir="ltr">{completion.completed}<span> / {completion.total}</span></b></div>
      <div className="completion-progress-track" role="progressbar" aria-label={copy('Required learning activities completed', 'الأنشطة التعليمية المطلوبة المكتملة')} aria-valuenow={completion.completed} aria-valuemin={0} aria-valuemax={completion.total}><i style={{ width: `${completion.total ? completion.completed / completion.total * 100 : 0}%` }} /></div>
      <div className="completion-roadmap-heading"><span />{copy('ONE JOURNEY. MORE POSSIBILITIES.', 'رحلة واحدة. آفاق أوسع.')}<span /></div>
      <CourseRoadmap lang={lang} />
      <div className="completion-popover-footer"><Sparkles size={13} /><span>{copy('Every lesson brings your next chapter closer.', 'مع كل درس، تقترب من رحلتك القادمة.')}</span></div>
    </div>, document.body)}
  </>;
}
