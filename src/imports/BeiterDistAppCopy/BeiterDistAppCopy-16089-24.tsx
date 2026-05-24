import svgPaths from "./svg-9mnkqkgciw";

function Icon() {
  return (
    <div className="relative shrink-0 size-[47.997px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47.9972 47.9972">
        <g id="Icon">
          <path d={svgPaths.p3ca8fc70} id="Vector" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d="M33.998 27.9983V41.9975" id="Vector_2" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d="M13.9992 27.9983V41.9975" id="Vector_3" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d="M33.998 5.99964V11.9993" id="Vector_4" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d="M13.9992 5.99964V11.9993" id="Vector_5" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d={svgPaths.p2a55eb80} id="Vector_6" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d={svgPaths.pce3b180} id="Vector_7" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
          <path d={svgPaths.p3d726280} id="Vector_8" stroke="var(--stroke-0, #E31E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[30504000px] shrink-0 size-[95.994px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[23.992px] pr-[24.006px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[95.994px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pl-[175.994px] pr-[176.008px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32.003px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[224.53px] not-italic text-[24px] text-center text-white top-[-1.09px] tracking-[0.96px] uppercase whitespace-nowrap">Distributor Portal</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[45.511px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-[224.04px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center top-[0.73px] w-[377px]">The Distributor Portal is currently under construction and temporarily unavailable.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[45.511px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-[224.3px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center top-[0.73px] w-[432px]">{`We're working hard to bring you an enhanced experience. Please check back soon.`}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[11.989px] h-[103.011px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[278.991px] relative shrink-0 w-[447.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.991px] items-start relative size-full">
        <Container1 />
        <Heading />
        <Container3 />
      </div>
    </div>
  );
}

export default function BeiterDistAppCopy() {
  return (
    <div className="bg-[#111] content-stretch flex flex-col items-center justify-center pb-[473.239px] pt-[473.224px] relative size-full" data-name="BeiterDIST APP copy">
      <Container />
    </div>
  );
}