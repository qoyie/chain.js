function chain(value){
  if(!new.target){
    return new chain(value);
  }
  this.value=value;
  this.cond=false;
}
chain.prototype={
  case(value,func,thisArg){
    if(!this.cond&&this.value===value){
      this.then(func,thisArg);
      this.cond=true;
    }
    return this;
  },
  catch(func,thisArg){
    if(this.cond){
      this.then(func,thisArg);
    }
    return this;
  },
  ctxmgr(){
    return this.then(chain.ctxmgr);
  },
  elif(cond,condThisArg,func,funcThisArg){
    if(this.cond){
      return this;
    }
    if(arguments.length===2){
      return this.elif(typeof(cond)==='function'?cond:()=>cond,void 0,condThisArg);
    }
    if(this.cond=cond.call(condThisArg,this.value)){
      return this.then(func,funcThisArg);
    }
    return this;
  },
  else(func,thisArg){
    if(!this.cond){
      this.then(func,thisArg);
    }
    return this;
  },
  for(cond,condThisArg,fin,finThisArg,body,bodyThisArg){
    if(arguments.length===2){
      return this.for(cond,void 0,()=>{},void 0,condThisArg);
    }else if(arguments.length===3){
      return this.for(cond,void 0,condThisArg,void 0,fin);
    }else if(arguments.length===4){
      return this.for(cond,condThisArg,()=>{},void 0,fin,finThisArg);
    }
    if(this.cond=cond.call(condThisArg,this.value)){
      let result;
      do{
        result=body.call(bodyThisArg,this.value);
        this.then(fin,finThisArg);
      }while(cond.call(condThisArg,this.value));
      this.value=result;
    }
    return this;
  },
  forEach(func,thisArg){
    let value;
    let cond=false;
    for(const e of this.value){
      value=func.call(thisArg,e);
      cond=true;
    }
    this.value=value;
    this.cond=cond;
    return this;
  },
  if(func,thisArg){
    if(this.cond=this.value){
      this.then(func,thisArg);
    }
    return this;
  },
  new(clz){
    this.value=new clz(this.value);
    return this;
  },
  then(func,thisArg){
    this.value=func.call(thisArg,this.value);
    return this;
  },
  try(func,thisArg){
    this.cond=false;
    try{
      this.then(func,thisArg);
    }catch(e){
      this.cond=true;
      this.value=e;
    }
    return this;
  },
  while(cond,condThisArg,func,funcThisArg){
    if(arguments.length==2){
      return this.while(cond,void 0,func);
    }
    if(this.cond=cond.call(condThisArg,this.value)){
      do{
        this.then(func,funcThisArg);
      }while(cond.call(condThisArg,this.value));
    }
    return this;
  },
  with(func,thisArg){
    const ctxmgr=this.value
    try{
      func.call(thisArg,ctxmgr.enter());
    }catch(e){
      if(!ctxmgr.exit(e.constructor,e,e.stack)){
        throw e;
      }
      return this;
    }
    ctxmgr.exit();
    return this;
  },
}
chain.ctxmgr=(func,thisArg)=>{
  const iter=func.call(thisArg);
  return{
    enter(){
      return iter.next().value;
    },
    exit(exc_type,exc_value,traceback){
      if(arguments.length===3){
        iter.throw(exc_value);
      }else{
        iter.next();
      }
    }
  }
}
module.exports=chain;
