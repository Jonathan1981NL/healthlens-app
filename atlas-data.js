
/* HealthLens - Atlas data.
   Stylised human silhouettes and organ hit regions per view.
   viewBox: 0 0 400 800
*/
window.BODY_VIEWS = {

  front: {
    label: "front",
    silhouette: `
      <ellipse cx="200" cy="90" rx="55" ry="65" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M145,150 Q120,220 130,320 L120,520 L140,720 L185,720 L195,520 L200,520 L205,520 L215,720 L260,720 L270,520 L270,320 Q280,220 255,150 Z"
            fill="var(--surface)" stroke="var(--line)"/>
      <path d="M132,190 L80,360 L95,520 L120,520 L135,360 Z" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M268,190 L320,360 L305,520 L280,520 L265,360 Z" fill="var(--surface)" stroke="var(--line)"/>
    `,
    hitRegions: [
      {id:"hersenen_f", organ:"hersenen", layer:"zenuw",
        path:"M155,55 Q200,20 245,55 Q255,105 200,140 Q145,105 155,55 Z", label:"Hersenen"},
      {id:"schildklier_f", organ:"schildklier", layer:"endo",
        path:"M180,155 L220,155 L215,175 L185,175 Z", label:"Schildklier"},
      {id:"longen_l_f", organ:"longen", layer:"adem",
        path:"M150,200 L150,290 L192,290 L192,200 Z", label:"Linker long"},
      {id:"longen_r_f", organ:"longen", layer:"adem",
        path:"M208,200 L208,290 L250,290 L250,200 Z", label:"Rechter long"},
      {id:"hart_f", organ:"hart", layer:"bloedbaan",
        path:"M180,240 L220,240 L215,300 L185,300 Z", label:"Hart"},
      {id:"ribbenkast_f", organ:"ribbenkast", layer:"skelet",
        path:"M148,190 L252,190 L250,320 L150,320 Z", label:"Ribbenkast"},
      {id:"lever_f", organ:"lever", layer:"spijs",
        path:"M150,310 L235,310 L235,360 L150,360 Z", label:"Lever"},
      {id:"maag_f", organ:"maag", layer:"spijs",
        path:"M200,330 L250,330 L250,375 L200,375 Z", label:"Maag"},
      {id:"milt_f", organ:"milt", layer:"lymfe",
        path:"M240,315 L268,315 L268,350 L240,350 Z", label:"Milt"},
      {id:"alvleesklier_f", organ:"alvleesklier", layer:"endo",
        path:"M180,360 L245,360 L245,380 L180,380 Z", label:"Alvleesklier"},
      {id:"nier_l_f", organ:"nieren", layer:"urin",
        path:"M155,375 L188,375 L188,425 L155,425 Z", label:"Linker nier"},
      {id:"nier_r_f", organ:"nieren", layer:"urin",
        path:"M212,375 L245,375 L245,425 L212,425 Z", label:"Rechter nier"},
      {id:"dunne_darm_f", organ:"dunne_darm", layer:"spijs",
        path:"M155,405 L245,405 L245,470 L155,470 Z", label:"Dunne darm"},
      {id:"dikke_darm_f", organ:"dikke_darm", layer:"spijs",
        path:"M150,455 L250,455 L250,505 L150,505 Z", label:"Dikke darm"},
      {id:"blaas_f", organ:"blaas", layer:"urin",
        path:"M180,505 L220,505 L220,540 L180,540 Z", label:"Blaas"},
      {id:"knie_l_f", organ:"knie", layer:"skelet",
        path:"M155,600 L195,600 L195,640 L155,640 Z", label:"Linker knie"},
      {id:"knie_r_f", organ:"knie", layer:"skelet",
        path:"M205,600 L245,600 L245,640 L205,640 Z", label:"Rechter knie"},
      {id:"schouder_l_f", organ:"schouder", layer:"skelet",
        path:"M118,175 L155,175 L155,215 L118,215 Z", label:"Linker schouder"},
      {id:"schouder_r_f", organ:"schouder", layer:"skelet",
        path:"M245,175 L282,175 L282,215 L245,215 Z", label:"Rechter schouder"},
      {id:"huid_f", organ:"huid", layer:"huid",
        path:"M145,150 Q120,220 130,320 L120,520 L140,720 L260,720 L270,520 L270,320 Q280,220 255,150 Z", label:"Huid"}
    ]
  },

  back: {
    label: "back",
    silhouette: `
      <ellipse cx="200" cy="90" rx="55" ry="65" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M145,150 Q120,220 130,320 L120,520 L140,720 L185,720 L195,520 L205,520 L215,720 L260,720 L270,520 L270,320 Q280,220 255,150 Z"
            fill="var(--surface)" stroke="var(--line)"/>
      <path d="M132,190 L80,360 L95,520 L120,520 L135,360 Z" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M268,190 L320,360 L305,520 L280,520 L265,360 Z" fill="var(--surface)" stroke="var(--line)"/>
    `,
    hitRegions: [
      {id:"hersenen_b", organ:"hersenen", layer:"zenuw",
        path:"M155,55 Q200,20 245,55 Q255,105 200,140 Q145,105 155,55 Z", label:"Hersenen"},
      {id:"wervelkolom_b", organ:"wervelkolom", layer:"skelet",
        path:"M195,155 L205,155 L205,510 L195,510 Z", label:"Wervelkolom"},
      {id:"ruggenmerg_b", organ:"ruggenmerg", layer:"zenuw",
        path:"M198,155 L202,155 L202,470 L198,470 Z", label:"Ruggenmerg"},
      {id:"longen_lb", organ:"longen", layer:"adem",
        path:"M150,200 L150,290 L192,290 L192,200 Z", label:"Linker long"},
      {id:"longen_rb", organ:"longen", layer:"adem",
        path:"M208,200 L208,290 L250,290 L250,200 Z", label:"Rechter long"},
      {id:"nier_lb", organ:"nieren", layer:"urin",
        path:"M150,340 L188,340 L188,405 L150,405 Z", label:"Linker nier"},
      {id:"nier_rb", organ:"nieren", layer:"urin",
        path:"M212,340 L250,340 L250,405 L212,405 Z", label:"Rechter nier"},
      {id:"bijnier_l_b", organ:"bijnier", layer:"endo",
        path:"M155,325 L190,325 L190,345 L155,345 Z", label:"Linker bijnier"},
      {id:"bijnier_r_b", organ:"bijnier", layer:"endo",
        path:"M210,325 L245,325 L245,345 L210,345 Z", label:"Rechter bijnier"},
      {id:"bekken_b", organ:"bekken", layer:"skelet",
        path:"M150,505 L250,505 L245,570 L155,570 Z", label:"Bekken"},
      {id:"huid_b", organ:"huid", layer:"huid",
        path:"M145,150 Q120,220 130,320 L120,520 L140,720 L260,720 L270,520 L270,320 Q280,220 255,150 Z", label:"Huid"}
    ]
  },

  left: {
    label: "left",
    silhouette: `
      <ellipse cx="200" cy="90" rx="45" ry="60" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M170,150 Q150,220 155,320 L150,520 L170,720 L215,720 L235,520 L245,320 Q245,220 230,150 Z"
            fill="var(--surface)" stroke="var(--line)"/>
      <path d="M165,190 L120,360 L135,520 L155,520 L170,360 Z" fill="var(--surface)" stroke="var(--line)"/>
    `,
    hitRegions: [
      {id:"hersenen_l", organ:"hersenen", layer:"zenuw",
        path:"M165,50 Q200,15 240,55 Q245,110 200,140 Q160,105 165,50 Z", label:"Hersenen"},
      {id:"hart_l", organ:"hart", layer:"bloedbaan",
        path:"M175,240 L220,240 L215,300 L180,300 Z", label:"Hart"},
      {id:"longen_l", organ:"longen", layer:"adem",
        path:"M170,200 L235,200 L235,290 L170,290 Z", label:"Longen"},
      {id:"lever_l", organ:"lever", layer:"spijs",
        path:"M175,310 L235,310 L235,370 L175,370 Z", label:"Lever"},
      {id:"dunne_darm_l", organ:"dunne_darm", layer:"spijs",
        path:"M170,405 L235,405 L235,475 L170,475 Z", label:"Dunne darm"},
      {id:"blaas_l", organ:"blaas", layer:"urin",
        path:"M180,505 L230,505 L230,545 L180,545 Z", label:"Blaas"},
      {id:"wervelkolom_l", organ:"wervelkolom", layer:"skelet",
        path:"M232,155 L242,155 L242,510 L232,510 Z", label:"Wervelkolom"}
    ]
  },

  right: {
    label: "right",
    silhouette: `
      <ellipse cx="200" cy="90" rx="45" ry="60" fill="var(--surface)" stroke="var(--line)"/>
      <path d="M170,150 Q155,220 155,320 L165,520 L185,720 L230,720 L250,520 L245,320 Q250,220 230,150 Z"
            fill="var(--surface)" stroke="var(--line)"/>
      <path d="M235,190 L280,360 L265,520 L245,520 L230,360 Z" fill="var(--surface)" stroke="var(--line)"/>
    `,
    hitRegions: [
      {id:"hersenen_r", organ:"hersenen", layer:"zenuw",
        path:"M160,50 Q200,15 235,55 Q240,110 200,140 Q155,105 160,50 Z", label:"Hersenen"},
      {id:"hart_r", organ:"hart", layer:"bloedbaan",
        path:"M180,240 L225,240 L220,300 L185,300 Z", label:"Hart"},
      {id:"longen_r", organ:"longen", layer:"adem",
        path:"M175,200 L240,200 L240,290 L175,290 Z", label:"Longen"},
      {id:"lever_r", organ:"lever", layer:"spijs",
        path:"M175,310 L245,310 L245,375 L175,375 Z", label:"Lever"},
      {id:"dunne_darm_r", organ:"dunne_darm", layer:"spijs",
        path:"M175,410 L240,410 L240,475 L175,475 Z", label:"Dunne darm"},
      {id:"wervelkolom_r", organ:"wervelkolom", layer:"skelet",
        path:"M160,155 L170,155 L170,510 L160,510 Z", label:"Wervelkolom"}
    ]
  }
};

/* Which organ types should be visible per layer.
   In 'lichaam' we show no hit regions to keep the atlas clean. */
window.LAYER_VISIBILITY = {
  lichaam:  [],
  organen:  ["hart","longen","lever","galblaas","alvleesklier","maag","dunne_darm","dikke_darm","nieren","blaas","milt","hersenen","schildklier","bijnier"],
  bloedbaan:["hart"],
  zenuw:    ["hersenen","ruggenmerg"],
  lymfe:    ["milt"],
  spier:    ["spieren"],
  skelet:   ["skelet","ribbenkast","wervelkolom","bekken","knie","schouder"],
  adem:     ["longen"],
  spijs:    ["maag","lever","galblaas","alvleesklier","dunne_darm","dikke_darm"],
  urin:     ["nieren","blaas"],
  endo:     ["schildklier","bijnier","alvleesklier"],
  huid:     ["huid"]
};
