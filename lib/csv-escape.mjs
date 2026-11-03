// CSV values are opened in Excel; never let user-controlled text become a formula.
const formula=/^\s*[=+\-@＝＋－＠]/u;
export function csvCell(value,forceText=false){
 let text=String(value??'').replace(/[\u0000-\u001f\u007f\u2028\u2029]/gu,' ');
 if(formula.test(text))text='\t'+text;
 else if(forceText)text="'"+text;
 return '"'+text.replace(/"/g,'""')+'"';
}
