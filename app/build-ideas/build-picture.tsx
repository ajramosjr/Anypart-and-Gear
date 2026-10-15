type Props = { kind: string; title: string };
const navy = '#0b2345', gold = '#d5a326', gray = '#64748b';
export default function BuildPicture({ kind, title }: Props) {
  const label = (x: number, y: number, text: string) => <text x={x} y={y} fill={navy} fontSize="16" fontWeight="700">{text}</text>;
  const line = (x1: number, y1: number, x2: number, y2: number, color = navy, width = 7) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  const wheel = (x: number, y: number) => <rect x={x} y={y} width="36" height="62" rx="10" fill={navy} />;
  const frame = <g fill="none" stroke={navy} strokeWidth="10" strokeLinejoin="round"><path d="M150 105H455V267H150Z" /><path d="M225 105V267M365 105V267" /><path d="M125 80H210L225 105M125 292H210L225 267" /></g>;
  const rolling = <>{frame}{wheel(155, 48)}{wheel(155, 264)}{wheel(413,48)}{wheel(413,264)}{line(430,90,430,286,gray,5)}</>;
  return <figure className="build-picture my-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><svg viewBox="0 0 640 380" role="img" aria-label={title + ' — schematic illustration, not to scale'} className="h-auto w-full"><rect width="640" height="380" fill="#f8fafc" />
    {kind === 'cut' ? <>
      {line(90,110,545,110)}{line(90,170,390,170)}{line(90,230,280,230)}
      <path d="M350 80V140M350 80L365 95M350 80L335 95" stroke={gold} strokeWidth="4" />
      <path d="M360 145L390 200M470 85V135" stroke={gold} strokeWidth="4" strokeDasharray="5 5" />
      <rect x="420" y="195" width="120" height="90" fill="#cbd5e1" stroke={navy} strokeWidth="3" /><circle cx="445" cy="218" r="7" fill={navy}/><circle cx="515" cy="260" r="7" fill={navy}/>
      {label(90,65,'Mark finished length before cutting')}{label(92,290,'Label matching tube pairs')}{label(390,325,'Drill clamped bracket stock')}
    </> : kind === 'frame' ? <>{frame}<path d="M150 105L455 267M455 105L150 267" stroke={gold} strokeWidth="3" strokeDasharray="8 6" />{[150,225,365,455].map(x=><g key={x}><circle cx={x} cy="105" r="7" fill={gold}/><circle cx={x} cy="267" r="7" fill={gold}/></g>)}{label(150,55,'TOP VIEW • clamp flat')}{label(160,325,'Compare diagonals before final welding')}</> : kind === 'axle' ? <>{frame}{line(430,65,430,310,gold,10)}{wheel(413,30)}{wheel(413,290)}{label(85,55,'Fixed axle: support stubs stay still')}{label(90,350,'Measure axle location from the plan datum')}{line(455,195,550,195,gray,2)}{label(490,178,'Rear')}
    </> : kind === 'floor' ? <>{frame}<rect x="152" y="108" width="210" height="155" fill="#cbd5e1" stroke={gray} strokeWidth="2" /><path d="M285 125V245M320 125V245" stroke={gold} strokeWidth="9" /><circle cx="285" cy="145" r="5" fill={navy}/><circle cx="285" cy="225" r="5" fill={navy}/><circle cx="320" cy="145" r="5" fill={navy}/><circle cx="320" cy="225" r="5" fill={navy}/>{label(110,60,'Floor sheet below frame')}{label(100,325,'Match supports to actual seat-slider spacing')}
    </> : kind === 'steering' ? <>
      {wheel(85,95)}{wheel(520,95)}{line(120,125,210,125)}{line(430,125,520,125)}
      <circle cx="320" cy="235" r="44" fill="none" stroke={navy} strokeWidth="8" />{line(320,195,320,145,gold,7)}{line(320,145,190,145,gold,5)}{line(320,145,450,145,gold,5)}{line(190,145,120,125)}{line(450,145,520,125)}
      {[190,320,450].map(x=><circle key={x} cx={x} cy="145" r="9" fill={gold} stroke={navy} strokeWidth="2"/>)}
      {label(95,65,'TOP VIEW • centered steering')}{label(80,335,'Sweep full travel: no contact, binding or over-center')}
    </> : kind === 'brakes' ? <>
      <circle cx="450" cy="182" r="70" fill="#cbd5e1" stroke={navy} strokeWidth="4" /><path d="M425 108A80 80 0 1 1 372 205" fill="none" stroke={gold} strokeWidth="13" />
      <path d="M120 255L150 175L180 175" fill="none" stroke={navy} strokeWidth="9" />{line(140,220,373,205,gold,5)}<circle cx="140" cy="220" r="8" fill={navy}/>
      {label(85,95,'Pedal')}{label(225,195,'Brake rod')}{label(405,65,'Band around drum')}{label(95,325,'Pedal applies band; return spring releases it')}
    </> : kind === 'engine' ? <>
      <rect x="90" y="105" width="155" height="140" rx="12" fill="#cbd5e1" stroke={navy} strokeWidth="4" /><rect x="85" y="245" width="180" height="18" fill={gold} /><circle cx="240" cy="177" r="27" fill="white" stroke={navy} strokeWidth="6" /><circle cx="480" cy="177" r="66" fill="white" stroke={navy} strokeWidth="6" /><path d="M240 150L480 111M240 204L480 243" stroke={gold} strokeWidth="5" /><path d="M237 177H550" stroke={gray} strokeWidth="2" strokeDasharray="5 5" />
      {label(105,70,'Engine + clutch')}{label(420,70,'Drive sprocket')}{label(95,322,'Align sprocket planes; retain adjustment travel')}
    </> : kind === 'throttle' ? <>
      <path d="M95 260L135 150L180 150" stroke={navy} strokeWidth="10" fill="none" /><circle cx="112" cy="215" r="8" fill={gold}/><path d="M150 170C260 70 365 115 480 165" stroke={gold} strokeWidth="7" fill="none" />
      <rect x="470" y="140" width="95" height="105" rx="8" fill="#cbd5e1" stroke={navy} strokeWidth="4" /><path d="M140 225l15 -15l-2 20l17 -15l-2 20l18 -15" stroke={gray} strokeWidth="3" fill="none" />
      {label(75,70,'Broad cable bends')}{label(400,110,'Engine linkage')}{label(85,325,'Release pedal → linkage returns fully to idle')}
    </> : <>{rolling}<rect x="270" y="125" width="90" height="120" rx="12" fill={gold} stroke={navy} strokeWidth="4" /><rect x="355" y="125" width="12" height="120" fill={navy} /><rect x="385" y="140" width="62" height="65" rx="6" fill="#cbd5e1" stroke={navy} strokeWidth="4" />
      <circle cx="230" cy="185" r="26" fill="white" stroke={navy} strokeWidth="6" />
      {label(95,30,kind==='test' ? 'Inspection before powered testing' : 'Final assembly • guards fitted')}{label(88,357,kind==='test' ? 'Brakes • steering • throttle return • kill switch' : 'Seat • controls • wheel retention • drive guards')}
    </>}
  </svg><figcaption className="border-t border-slate-200 px-4 py-2 text-xs text-slate-600">APG explanatory diagram · Not to scale. Use the linked fabrication drawings for geometry, dimensions and hardware.</figcaption></figure>;
}
