import React, { useRef } from 'react'
import Flexbox from './Flexbox';



const ConfigBar = ({defaultUrl, onUrlUpdate, onDepthChange, ...otherProps}) => {

  let url = useRef(null);
  let depth = useRef(null); 
  let code = useRef(null);
  
  return (
  <Flexbox {...otherProps} style={{flexDirection: 'column'}}>
    <Flexbox style={{flexDirection: 'row'}}>
      <input 
        defaultValue={defaultUrl}
        ref={url} 
        placeholder='Remote server'></input>
      <input
        ref={code}
        defaultValue={'accounting'}
        placeholder='Code'/>

      <button onClick={() => onUrlUpdate(url.current.value, code.current.value)}>update</button>
    </Flexbox>
    <Flexbox style={{justifyContent: 'space-between'}}>
      <p>Connections Depth: </p>
      <input
        ref={depth}
        onChange={({ target }) => onDepthChange(target.value)} 
        type="number" 
        min="0" 
        max="10" 
        step="1" 
        defaultValue={1} 
        size="6"/>
    </Flexbox>
  </Flexbox>
  );
};

export default ConfigBar;