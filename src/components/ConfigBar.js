import React, { useRef, forwardRef } from 'react'
import Flexbox from './Flexbox';


const SpinnerInput = forwardRef(({label, onChange, min, max, step, defaultVal}, ref) => (
<Flexbox style={{justifyContent: 'space-between'}}>
  <p>{label}</p>
  <input
    ref={ref}
    onChange={({ target }) => onChange && onChange(target.value)} 
    type="number" 
    min={min}
    max={max} 
    step={step} 
    defaultValue={defaultVal}/>
</Flexbox>
))


const ConfigBar = ({defaultUrl, 
                    onUrlUpdate, 
                    onDepthChange,
                    onMaxNodesChange,
                    onMaxEdgesChange,
                    ...otherProps}) => {

  let url = useRef(null);
  let code = useRef(null);
  
  return (
  <Flexbox {...otherProps} style={{flexDirection: 'column'}}>
    <Flexbox style={{flexDirection: 'row'}}>
      <input
        style={{marginRight: 5, padding: 5}}
        defaultValue={defaultUrl}
        ref={url} 
        placeholder='Remote server'></input>
      <input
        style={{marginRight: 5, padding: 5}}
        ref={code}
        defaultValue={'accounting'}
        placeholder='Code'/>

      <button onClick={() => onUrlUpdate(url.current.value, code.current.value)}>update</button>
    </Flexbox>
    <SpinnerInput
      defaultVal={2}
      min={0}
      max={10}
      step={1}
      onChange={onDepthChange}
      label='Connections Depth'/>
    <SpinnerInput
      defaultVal={100}
      min={1}
      max={1000000}
      step={100}
      onChange={onMaxNodesChange}
      label='Max node count'/>
    <SpinnerInput
      defaultVal={1000}
      min={1}
      max={1000000}
      step={100}
      onChange={onMaxEdgesChange}
      label='Max edge count'/>
  </Flexbox>
  );
};

export default ConfigBar;