'use client';
import {useState} from 'react';
import {vocabulary} from '../../lib/data';
import {useStudent} from '../../lib/student';

export default function Lingo(){
 const {student,learnTerm}=useStudent();
 const [wordId,setWordId]=useState<string|null>(null),[selected,setSelected]=useState<string|null>(null),[checked,setChecked]=useState(false),[earned,setEarned]=useState(0),[review,setReview]=useState(false),[reviewIndex,setReviewIndex]=useState(0);
 const complete=vocabulary.every(v=>student.learnedVocabulary.includes(v.id));
 const word=vocabulary.find(v=>v.id===wordId) || (review?vocabulary[reviewIndex%vocabulary.length]:vocabulary.find(v=>!student.learnedVocabulary.includes(v.id)));
 const next=()=>{setSelected(null);setChecked(false);setEarned(0);setWordId(null);if(review)setReviewIndex(i=>i+1)};
 const startReview=()=>{setReview(true);setReviewIndex(0);next()};
 const submit=()=>{if(!word||!selected||checked)return;setChecked(true);if(selected===word.term)setEarned(learnTerm(word.id)?20:0)};
 const options=word?[word.term,...vocabulary.filter(v=>v.id!==word.id).slice(0,3).map(v=>v.term)]:[];
 return <><h1 className="page-title">AI Lingo</h1><p className="page-sub">Build a vocabulary for thinking clearly about AI.</p>
 {complete&&!review&&!wordId?<div className="card"><h2>Collection complete!</h2><p>You learned all {vocabulary.length} terms.</p><button className="btn" onClick={startReview}>Review vocabulary</button></div>:word&&<div className="card" style={{maxWidth:760}}><div className="step-label">{review?'REVIEW':'TODAY’S WORD'}</div><div className="word">{word.term.toUpperCase()}</div><p>{word.definition}</p><div style={{marginTop:25,paddingTop:20,borderTop:'1px solid #e6e9f2'}}><b>Practice</b><p>Which AI term means: “{word.definition}”?</p>
 {options.map(option=><button key={option} className={'choice '+(checked?(option===word.term?'correct':option===selected?'wrong':''):'')} onClick={()=>{if(!checked){setWordId(word.id);setSelected(option)}}} aria-pressed={selected===option}>{option}</button>)}
 {!checked?<button className="btn" disabled={!selected} onClick={submit}>Check answer</button>:<><div className={'feedback '+(selected===word.term?'':'wrong-feedback')} role="status">{selected===word.term?`Correct! ${word.term} is the match. +${earned} XP`:`Not quite. ${selected} means something different. Look for the term that matches the definition above.`}</div><button className="btn" style={{marginTop:16}} onClick={selected===word.term?next:()=>{setSelected(null);setChecked(false)}}>{selected===word.term?'Next word →':'Try again'}</button></>}</div></div>}
 <div className="unit-title">YOUR AI LINGO COLLECTION · {student.learnedVocabulary.length} / {vocabulary.length} LEARNED</div><div className="grid">{vocabulary.map(v=><div className={'badge '+(!student.learnedVocabulary.includes(v.id)?'locked':'')} key={v.id}><div className="emoji">{student.learnedVocabulary.includes(v.id)?'✨':'🔒'}</div><h3>{v.term}</h3><p>{v.definition}</p>{student.learnedVocabulary.includes(v.id)&&<p style={{marginTop:9}}><b>Example:</b> {v.example}</p>}</div>)}</div></>
}
