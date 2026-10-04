'use client';
import {useEffect,useState} from 'react';
import {motion} from 'framer-motion';
import {vocabulary} from '../../lib/data';
import {useStudent} from '../../lib/student';

export default function Lingo(){
 const {student,learnTerm}=useStudent(); const [selected,setSelected]=useState<string|null>(null); const [checked,setChecked]=useState(false);
 const word=vocabulary.find(v=>!student.learnedVocabulary.includes(v.id))||vocabulary[0];
 const options=[word.term,...vocabulary.filter(v=>v.id!==word.id).slice(0,3).map(v=>v.term)].sort((a,b)=>a===word.term?-1:b===word.term?1:0);
 const correct=selected===word.term; useEffect(()=>{setSelected(null);setChecked(false)},[word.id]); const submit=()=>{if(!selected)return;setChecked(true);if(correct)learnTerm(word.id)};
 return <><h1 className="page-title">AI Lingo</h1><p className="page-sub">Build a vocabulary for thinking clearly about AI.</p>
 <div className="card" style={{maxWidth:760}}><div className="step-label">TODAY&apos;S WORD</div><div className="word">{word.term.toUpperCase()}</div><p>{word.definition}</p>
 <div style={{marginTop:25,paddingTop:20,borderTop:'1px solid #e6e9f2'}}><b>Practice</b><p style={{fontSize:16}}>Which AI term means: “{word.definition}”?</p>
 {options.map(option=><button key={option} className={'choice '+(checked?(option===word.term?'correct':option===selected?'wrong':''):'')} onClick={()=>!checked&&setSelected(option)} aria-pressed={selected===option}>{option}</button>)}
 <div style={{marginTop:16}}><button className="btn" disabled={!selected||checked} onClick={submit}>Check answer</button></div>
 {checked&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={'feedback '+(correct?'':'wrong-feedback')}>{correct?`🎉 Exactly! ${word.term} is now in your collection. +20 XP`:`Not quite — ${word.term} is the best match.`}</motion.div>}</div></div>
 <div className="unit-title">YOUR AI LINGO COLLECTION · {student.learnedVocabulary.length} / {vocabulary.length} LEARNED</div><div className="grid">{vocabulary.map(v=><div className={'badge '+(!student.learnedVocabulary.includes(v.id)?'locked':'')} key={v.id}><div className="emoji">{student.learnedVocabulary.includes(v.id)?'✨':'🔒'}</div><h3>{v.term}</h3><p>{v.definition}</p>{student.learnedVocabulary.includes(v.id)&&<p style={{marginTop:9}}><b>Example:</b> {v.example}</p>}</div>)}</div></>}
