function chain(value){
  if(!new.target){
    return new chain(value);
  }
  this.value=value;
  this.cond=false;
}
chain.prototype={
  case(value,func){
    if(!this.cond&&this.value===value){
      this.then(func);
      this.cond=true;
    }
    return this;
  },
  catch(func){
    if(this.cond){
      this.then(func);
    }
    return this;
  },
  ctxmgr(){
    return this.then(chain.ctxmgr);
  },
  elif(cond,func){
    if(this.cond){
      return this;
    }
    if(this.cond=cond(this.value)){
      return this.then(func);
    }
    return this;
  },
  else(func){
    if(!this.cond){
      this.then(func);
    }
    return this;
  },
  for(cond,fin,body){
    if(arguments.length===2){
      return this.for(cond,()=>{},fin);
    }
    if(this.cond=cond(this.value)){
      let result;
      do{
        result=body(this.value);
        this.then(fin);
      }while(cond(this.value));
      this.value=result;
    }
    return this;
  },
  forEach(func){
    let value;
    let cond=false;
    for(const e of this.value){
      value=func(e);
      cond=true;
    }
    this.value=value;
    this.cond=cond;
    return this;
  },
  if(func){
    if(this.cond=this.value){
      this.then(func);
    }
    return this;
  },
  new(clz){
    this.value=new clz(this.value);
    return this;
  },
  then(func){
    this.value=func(this.value);
    return this;
  },
  try(func){
    this.cond=false;
    try{
      this.then(func);
    }catch(e){
      this.cond=true;
      this.value=e;
    }
    return this;
  },
  while(cond,func){
    if(this.cond=cond(this.value)){
      do{
        this.then(func);
      }while(cond(this.value));
    }
    return this;
  },
  with(func){
    const ctxmgr=this.value;
    try{
      func(ctxmgr.enter());
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
chain.ctxmgr=(func)=>{
  const iter=func();
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
export default chain;
