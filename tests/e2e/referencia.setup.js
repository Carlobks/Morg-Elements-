// Monta a página de referência em tests/.ref a partir do commit REF_COMMIT.
// A referência é a versão aprovada pelo dono; o teste de referência compara com ela.
const {execFileSync}=require('child_process');
const fs=require('fs');
const path=require('path');
const {REF_COMMIT,REF_DIR}=require('./apoio');

module.exports=()=>{
  const raiz=path.resolve(__dirname,'../..');
  fs.rmSync(REF_DIR,{recursive:true,force:true});
  fs.mkdirSync(REF_DIR,{recursive:true});
  const tar=execFileSync('git',['archive',REF_COMMIT],{cwd:raiz,maxBuffer:1<<28});
  execFileSync('tar',['-x','-C',REF_DIR],{input:tar});
};
