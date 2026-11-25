'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Award, BookOpen, BrainCircuit, Check, ChevronDown, Flame, Heart, Lock, Sparkles, Trophy, Zap} from 'lucide-react';
import {courseLessons as lessons} from '../lib/course';
import {formatLearningTime,useStudent} from '../lib/student';

const offsets = [50, 59, 50, 41];
const rowHeight = 150;
const milestones: Record<number, string> = {3: 'AI Foundations', 8: 'AI Lingo', 12: 'Using AI', 17: 'Responsible AI'};
const x = (i: number) => offsets[i % offsets.length];
const y = (i: number) => 105 + i * rowHeight;
const segment = (i: number) => `M ${x(i)} ${y(i)} C ${x(i)} ${y(i) + rowHeight / 2}, ${x(i + 1)} ${y(i + 1) - rowHeight / 2}, ${x(i + 1)} ${y(i + 1)}`;

export function LearningPath() {
  const {student, isUnlocked} = useStudent();
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);
  const nextIndex = lessons.findIndex(lesson => !student.completedLessons.includes(lesson.id));
  const currentIndex = nextIndex < 0 ? lessons.length : nextIndex;
  const completed = lessons.filter(lesson => student.completedLessons.includes(lesson.id)).length;
  const goal = Math.min(100, student.dailyLearningSeconds / 600 * 100);
  const scrollToCurrent = () => document.getElementById('current-learning-stop')?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});

  useEffect(() => {
    setReady(true);
    if (sessionStorage.getItem('ai-lingo-return-from-lesson') === 'true') {
      sessionStorage.removeItem('ai-lingo-return-from-lesson');
      requestAnimationFrame(() => document.getElementById('current-learning-stop')?.scrollIntoView({block: 'center'}));
    }
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const week = Array.from({length: 7}, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - 6 + index);
    return {day: 'SMTWTFS'[date.getDay()], key: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`};
  });
  const height = y(lessons.length) + 140;
  return <div className="journey-page">
    <header className="journey-header"><div><span className="eyebrow">Your AI journey</span><h1>One concept at a time.</h1><p>Follow the path and build your AI fluency.</p></div><div className="journey-stats" aria-label="Your learning stats"><span><Flame/> {student.streak} day streak</span><span><Zap/> {student.xp} XP</span><span><Heart/> {student.hearts}/{student.maxHearts}</span></div></header>
    <div className="journey-layout">
      <section className="adventure-path" aria-label="Complete learning path" style={{height}}>
        <div className="adventure-intro"><span>THE LEARNING PATH</span><strong>Ready when you are <Sparkles size={17}/></strong></div>
        <svg className="adventure-lines" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">{lessons.map((lesson, i) => <path key={lesson.id} d={segment(i)} className={student.completedLessons.includes(lesson.id) ? 'line-complete' : ''}/>)}</svg>
        {lessons.map((lesson, i) => {
          const done = student.completedLessons.includes(lesson.id), unlocked = isUnlocked(lesson.id), current = i === currentIndex;
          const status = done ? 'done' : current ? 'current' : 'locked';
          return <div key={lesson.id} id={current ? 'current-learning-stop' : undefined} className={`adventure-stop ${status}`} style={{top: y(i), left: `${x(i)}%`}}>
            {current && <span className="start-flag">START</span>}
            {unlocked ? <Link className="adventure-node" href={`/lesson/${lesson.id}`} onClick={() => sessionStorage.setItem('ai-lingo-return-from-lesson', 'true')} aria-label={`${lesson.title}, ${done ? 'review' : 'start lesson'}`}>{done ? <Check/> : <span aria-hidden="true">{lesson.icon}</span>}</Link> : <button className="adventure-node" onClick={() => setNotice(`Complete ${lessons[i - 1]?.title ?? 'the previous lesson'} first to unlock ${lesson.title}.`)} aria-label={`${lesson.title}, locked`}><span aria-hidden="true">{lesson.icon}</span><Lock className="node-lock" size={14}/></button>}
            <div className={`adventure-label ${x(i) >= 50 ? 'label-left' : 'label-right'}`}><span className="adventure-unit">{lesson.unit}</span><strong>{lesson.title}</strong><small>{lesson.description}</small>{current ? <Link href={`/lesson/${lesson.id}`} className="adventure-cta" onClick={() => sessionStorage.setItem('ai-lingo-return-from-lesson', 'true')}>Start lesson <span>→</span></Link> : <span className="adventure-status">{done ? '✓ Completed · review' : 'Locked'}</span>}</div>
            {milestones[i] && <div className="adventure-milestone">{lessons.filter(l => l.unit === lesson.unit).every(l => student.completedLessons.includes(l.id)) ? '✓ Unit complete' : 'Unit milestone'} · {milestones[i]}</div>}
          </div>;
        })}
        <div id={currentIndex === lessons.length ? 'current-learning-stop' : undefined} className="adventure-stop final-stop" style={{top:y(lessons.length),left:`${x(lessons.length)}%`}}>
          <Link href="/challenge" className="adventure-node" aria-label="AI Lingo final challenge"><Trophy size={36}/></Link>
          <div className="adventure-label label-left"><span className="adventure-unit">FINAL DESTINATION</span><strong>AI Lingo Final Challenge</strong><small>{completed === lessons.length ? "You're ready to prove your AI fluency!" : `Complete all ${lessons.length} lessons to unlock.`}</small><Link href="/challenge" className="adventure-cta">{completed === lessons.length ? 'Start challenge →' : 'View challenge →'}</Link></div>
        </div>
      </section>
      <aside className="journey-rail adventure-rail">
        <section className="rail-card"><div className="rail-heading"><BrainCircuit/> Overall course progress</div><p>Your journey to AI fluency</p><div className="progress"><span style={{width:`${completed/lessons.length*100}%`}}/></div><b>{completed} of {lessons.length} lessons completed</b></section>
        <section className="rail-card"><div className="rail-heading"><Zap/> Today&apos;s goal</div><p>10 minutes of focused practice</p><div className="progress"><span style={{width:`${goal}%`}}/></div><b>{formatLearningTime(student.dailyLearningSeconds)} / 10:00 · {Math.floor(goal)}%</b></section>
        <section className="rail-card"><div className="rail-heading"><Flame/> Learning rhythm</div><p>{student.streak ? `${student.streak} days in a row` : 'Complete a lesson to start your streak'}</p><div className="rail-week">{week.map(({day,key})=><span className={student.activityDates.includes(key)?'active':''} key={key}>{day}<i>{student.activityDates.includes(key)?<Check size={12}/>:null}</i></span>)}</div></section>
        <section className="rail-card achievement-card"><div className="achievement-mark"><Award size={21}/></div><div><span className="eyebrow">Achievements</span><b>{student.unlockedBadges.length ? `${student.unlockedBadges.length} badges earned` : 'Your first badge awaits'}</b><p>Keep learning to unlock more.</p></div></section>
        <section className="rail-card"><div className="rail-heading"><BookOpen/> Current milestone</div><p>{nextIndex < 0 ? 'Final challenge' : lessons[nextIndex].unit}</p></section>
      </aside>
    </div>
    {ready && <button className="current-shortcut" onClick={scrollToCurrent}><ChevronDown size={16}/> Current lesson</button>}
    {notice && <div className="xp-float" role="status">{notice}</div>}
  </div>;
}
