import tableau from "tableau-api";
import React, { useEffect, useRef } from 'react';

export default function AlzheimerTableau() {
  const ref = useRef(null);
  const url =  "https://public.tableau.com/views/w209_Covid_Dashboard1/Story1?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link";
  useEffect(() => {
    ref.current = new window.tableau.Viz(ref.current,url);
  }, [])
  return (
    <div ref={ref} style={{width:'70%', margin:'auto'}}> </div>
  );
}