import svgPaths from "./svg-qf5gjbqtgk";
import imgImageBeiterOsLogo from "figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png";
import imgImageBrh7020VRotaryHammer from "figma:asset/6798adb6ef4bc246d41b26b2dca7257c9904815e.png";
import imgImageBa61820VAngleGrinder from "figma:asset/efb9e1a62189555beb8fd857e8369c7aab388007.png";
import imgImageBiBts125CircularSaw from "figma:asset/f59093520509a0a8ce4901fb8c69282bb0ec1bee.png";

function ImageBeiterOsLogo() {
  return (
    <div className="relative shrink-0 size-[29.433px]" data-name="Image (BeiterOS logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageBeiterOsLogo} />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#f31a1a] relative rounded-[14px] shrink-0 size-[31.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip pr-[0.008px] relative rounded-[inherit] size-full">
        <ImageBeiterOsLogo />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[25.502px] relative shrink-0 w-[72.46px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25.5px] left-0 not-italic text-[#1d1d1f] text-[17px] top-[0.1px]">BeiterOS</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[112.449px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.993px] items-center relative size-full">
        <Container3 />
        <Text />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9948 14.9948">
        <g id="Icon">
          <path d={svgPaths.p21a71800} id="Vector" stroke="var(--stroke-0, #6C6C70)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24957" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#f2f2f7] content-stretch flex items-center justify-center left-[39.99px] rounded-[17586600px] size-[31.996px] top-0" data-name="Button">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[17.992px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9922 17.9922">
        <g clipPath="url(#clip0_12005_300)" id="Icon">
          <path d={svgPaths.p185fe5c8} id="Vector" stroke="var(--stroke-0, #1D1D1F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12451" />
          <path d={svgPaths.p17df8660} id="Vector_2" stroke="var(--stroke-0, #1D1D1F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12451" />
        </g>
        <defs>
          <clipPath id="clip0_12005_300">
            <rect fill="white" height="17.9922" width="17.9922" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#f2f2f7] content-stretch flex items-center justify-center left-0 rounded-[17586600px] size-[31.996px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[#ff3b30] content-stretch flex items-center justify-center left-[18px] rounded-[17586600px] size-[15.994px] top-[-2px]" data-name="Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[13.5px] not-italic relative shrink-0 text-[9px] text-white">2</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute left-0 size-[31.996px] top-0" data-name="Container">
      <Container6 />
      <Text1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[71.985px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button />
        <Container5 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[43.994px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.994px] relative size-full">
          <Container2 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] content-stretch flex flex-col h-[62px] items-start pb-[0.524px] relative shrink-0 w-[393px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e5ea] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[red] left-[201.11px] opacity-12 rounded-[17586600px] size-[199.994px] top-[-60px]" data-name="Container" />;
}

function Container9() {
  return <div className="absolute bg-[#f31a1a] left-[-40px] opacity-12 rounded-[17586600px] size-[159.997px] top-[123.45px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="h-[22.505px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[15px] text-[rgba(255,255,255,0.7)] top-[-1.43px]">Good Morning,</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[41.995px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[28px] text-white top-[-0.33px]">Timothy 👋</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[66.498px] relative shrink-0 w-[147.557px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-start relative size-full">
        <Paragraph />
        <Heading />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[27.001px] relative shrink-0 w-[25.461px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[18px] text-white top-[0.62px]">TH</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#f31a1a] relative rounded-[17586600px] shrink-0 size-[55.999px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <Text2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex h-[66.498px] items-start justify-between left-[20px] top-[20px] w-[321.107px]" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.6)] top-[0.57px] tracking-[0.55px] uppercase">Level 3 · Apprentice</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[41.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[28px] text-white top-[-0.33px]">2.350 pts</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[60.487px] relative shrink-0 w-[132.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[36.001px] relative shrink-0 w-[15.494px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[24px] text-[rgba(222,249,255,0.9)] top-[-0.86px]">3</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[rgba(0,0,0,0.11)] relative rounded-[17586600px] shrink-0 size-[55.999px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.572px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[17586600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.572px] relative size-full">
        <Text3 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex h-[60.487px] items-center justify-between left-[15.99px] top-[15.99px] w-[289.119px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return <div className="bg-[#ff5e61] h-[7.993px] rounded-[17586600px] shrink-0 w-full" data-name="Container" />;
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex flex-col h-[7.993px] items-start left-[15.99px] overflow-clip pr-[125.29px] rounded-[17586600px] top-[88.48px] w-[289.119px]" data-name="Container">
      <Container18 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[48.956px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.7)] top-[0.57px]">2.350 pts</p>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[135.396px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.7)] top-[0.57px]">Progress to Builder: 3.000</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[15.99px] top-[104.46px] w-[289.119px]" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#9f0202] h-[136.952px] left-[20px] rounded-[16px] top-[102.49px] w-[321.107px]" data-name="Container">
      <Container14 />
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[259.441px] overflow-clip relative rounded-[24px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(149.809deg, rgb(167, 0, 0) 11.575%, rgb(214, 0, 0) 88.425%)" }}>
      <Container8 />
      <Container9 />
      <Container10 />
      <Container13 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9948 14.9948">
        <g clipPath="url(#clip0_12005_295)" id="Icon">
          <path d={svgPaths.p173cf300} id="Vector" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24957" />
          <path d="M7.49741 5.62306V8.1222" id="Vector_2" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24957" />
          <path d="M7.49741 10.6213H7.50366" id="Vector_3" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24957" />
        </g>
        <defs>
          <clipPath id="clip0_12005_295">
            <rect fill="white" height="14.9948" width="14.9948" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21.006px] relative shrink-0 w-[109.181px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#1d1d1f] text-[14px] top-[0.1px]">Needs Attention</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[21.006px] relative shrink-0 w-[132.169px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.993px] items-center relative size-full">
        <Icon2 />
        <Text4 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[21.006px] relative shrink-0 w-[52.216px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[26px] not-italic text-[#f31a1a] text-[14px] text-center top-[0.1px]">Dismiss</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex h-[45.525px] items-center justify-between left-0 pb-[0.524px] px-[15.994px] top-0 w-[361.104px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f2f2f7] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <Container22 />
      <Button1 />
    </div>
  );
}

function ImageBrh7020VRotaryHammer() {
  return (
    <div className="relative rounded-[14px] shrink-0 size-[39.997px]" data-name="Image (BRH70-20V Rotary Hammer)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgImageBrh7020VRotaryHammer} />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[21.006px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#1d1d1f] text-[14px] top-[0.1px]">BRH70-20V Rotary Hammer</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#6c6c70] text-[12px] top-[0.57px]">Next maintenance: 2025-09-15</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[38.998px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[#fff3e0] h-[20.49px] relative rounded-[17586600px] shrink-0 w-[37.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[7.99px] not-italic text-[#b97a00] text-[11px] top-[2.57px]">Due</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex gap-[11.997px] h-[64.516px] items-center left-0 pb-[0.524px] px-[15.994px] top-[45.52px] w-[361.104px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#f2f2f7] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <ImageBrh7020VRotaryHammer />
      <Container23 />
      <Text5 />
    </div>
  );
}

function ImageBa61820VAngleGrinder() {
  return (
    <div className="relative rounded-[14px] shrink-0 size-[39.997px]" data-name="Image (BA618-20V Angle Grinder)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgImageBa61820VAngleGrinder} />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[21.006px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#1d1d1f] text-[14px] top-[0.1px]">BA618-20V Angle Grinder</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#6c6c70] text-[12px] top-[0.57px]">Next maintenance: 2025-02-20</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] h-[38.998px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[#fee] h-[20.49px] relative rounded-[17586600px] shrink-0 w-[61.421px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[7.99px] not-italic text-[#c0392b] text-[11px] top-[2.57px]">Overdue</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex gap-[11.997px] h-[63.992px] items-center left-0 px-[15.994px] top-[110.04px] w-[361.104px]" data-name="Button">
      <ImageBa61820VAngleGrinder />
      <Container24 />
      <Text6 />
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white h-[174.033px] overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container21 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.993 16.993">
        <g clipPath="url(#clip0_12005_279)" id="Icon">
          <path d={svgPaths.p12a2f880} id="Vector" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41609" />
        </g>
        <defs>
          <clipPath id="clip0_12005_279">
            <rect fill="white" height="16.993" width="16.993" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[#e8f7ff] content-stretch flex items-center justify-center left-[38.19px] rounded-[14px] size-[35.992px] top-[14px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[32.995px] left-[14px] top-[57.98px] w-[84.376px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[33px] left-[42.58px] not-italic text-[#1d1d1f] text-[22px] text-center top-[-0.38px]">3</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute content-stretch flex h-[12.497px] items-start left-[14px] top-[92.97px] w-[84.376px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] min-h-px min-w-px not-italic relative text-[#6c6c70] text-[10px] text-center whitespace-pre-wrap">Registered</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-white h-[119.467px] left-0 rounded-[16px] top-0 w-[112.367px]" data-name="Container">
      <Container28 />
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.993 16.993">
        <g clipPath="url(#clip0_12005_286)" id="Icon">
          <path d={svgPaths.p1080b500} id="Vector" stroke="var(--stroke-0, #34C759)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41609" />
          <path d={svgPaths.p10adfac0} id="Vector_2" stroke="var(--stroke-0, #34C759)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41609" />
        </g>
        <defs>
          <clipPath id="clip0_12005_286">
            <rect fill="white" height="16.993" width="16.993" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-[#e8f8ee] content-stretch flex items-center justify-center left-[38.19px] rounded-[14px] size-[35.992px] top-[14px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[32.995px] left-[14px] top-[57.98px] w-[84.376px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[33px] left-[42.94px] not-italic text-[#1d1d1f] text-[22px] text-center top-[-0.38px]">1</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute content-stretch flex h-[12.497px] items-start left-[14px] top-[92.97px] w-[84.376px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] min-h-px min-w-px not-italic relative text-[#6c6c70] text-[10px] text-center whitespace-pre-wrap">Active Warranty</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-white h-[119.467px] left-[124.36px] rounded-[16px] top-0 w-[112.367px]" data-name="Container">
      <Container30 />
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Icon">
          <path d={svgPaths.p2f8b0500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M8.5 6.375V9.20833" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M8.5 12.0417H8.50667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-[rgba(255,0,0,0.63)] content-stretch flex items-center justify-center left-[38.19px] rounded-[14px] size-[35.992px] top-[14px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[32.995px] left-[14px] top-[57.98px] w-[84.376px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[33px] left-[42.94px] not-italic text-[#1d1d1f] text-[22px] text-center top-[-0.38px]">1</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute content-stretch flex h-[12.497px] items-start left-[14px] top-[92.97px] w-[84.376px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] min-h-px min-w-px not-italic relative text-[#6c6c70] text-[10px] text-center whitespace-pre-wrap">Expiring Soon</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-white h-[119.467px] left-[248.73px] rounded-[16px] top-0 w-[112.367px]" data-name="Container">
      <Container32 />
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[119.467px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container29 />
      <Container31 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[17.992px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9922 17.9922">
        <g clipPath="url(#clip0_12005_269)" id="Icon">
          <path d={svgPaths.p3c12c400} id="Vector" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d={svgPaths.p3f5d1be0} id="Vector_2" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d="M8.99608 13.1193V4.87287" id="Vector_3" stroke="var(--stroke-0, #FF9500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
        </g>
        <defs>
          <clipPath id="clip0_12005_269">
            <rect fill="white" height="17.9922" width="17.9922" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#fff3e0] relative rounded-[14px] shrink-0 size-[39.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex h-[16.24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.25px] not-italic relative shrink-0 text-[#1d1d1f] text-[13px]">Receipt Vault</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#8e8e93] text-[11px] top-[0.57px]">3 receipts</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[34.731px] relative shrink-0 w-[82.967px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-start relative size-full">
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[11.997px] h-[67.989px] items-center left-0 pl-[15.994px] rounded-[16px] top-0 w-[174.549px]" data-name="Button">
      <Container34 />
      <Container35 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[17.992px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9922 17.9922">
        <g id="Icon">
          <path d={svgPaths.p352a9b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d={svgPaths.p1e4edf40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d={svgPaths.p4178f00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d={svgPaths.p215e1a40} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
          <path d="M5.24771 8.99608H12.7444" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[14px] shrink-0 size-[39.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex h-[16.24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.25px] not-italic relative shrink-0 text-[13px] text-white">Scan Receipt</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.7)] top-[0.57px]">Add to vault</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[34.731px] relative shrink-0 w-[82.214px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-start relative size-full">
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#f31a1a] content-stretch flex gap-[11.997px] h-[67.989px] items-center left-[186.55px] pl-[15.994px] rounded-[16px] top-0 w-[174.557px]" data-name="Button">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[67.989px] relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[11.998px] h-[199.453px] items-start relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container33 />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[83.622px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#6c6c70] text-[12px] top-[0.57px] tracking-[0.3px] uppercase">My Toolbox</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[55.75px] size-[13.996px] top-[3.51px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9957 13.9957">
        <g id="Icon">
          <path d={svgPaths.p23aebf00} id="Vector" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45789" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[21.006px] relative shrink-0 w-[69.749px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[27px] not-italic text-[#f31a1a] text-[14px] text-center top-[0.1px]">{`View All `}</p>
        <Icon8 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex h-[21.006px] items-center justify-between left-0 top-0 w-[361.104px]" data-name="Container">
      <Paragraph19 />
      <Button6 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="absolute h-[14.995px] left-[12px] top-[134px] w-[152.004px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#f31a1a] text-[10px] top-[0.05px] tracking-[0.25px] uppercase">Rotary Hammer</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="absolute h-[32.479px] left-[12px] overflow-clip top-[150.99px] w-[152.004px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.25px] left-0 not-italic text-[#1d1d1f] text-[13px] top-0 w-[118px] whitespace-pre-wrap">BRH70-20V Rotary Hammer</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#e8f8ee] h-[16.051px] left-[12px] rounded-[17586600px] top-[197.85px] w-[56.826px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[7.99px] not-italic text-[#1a8a4a] text-[10px] top-px">✓ Active</p>
    </div>
  );
}

function ImageBrh7020VRotaryHammer1() {
  return (
    <div className="absolute h-[111.998px] left-0 rounded-[14px] top-0 w-[152.004px]" data-name="Image (BRH70-20V Rotary Hammer)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgImageBrh7020VRotaryHammer} />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[9.999px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99928 9.99928">
        <g clipPath="url(#clip0_12005_250)" id="Icon">
          <path d={svgPaths.p33b70000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M4.99964 3.74973V5.41628" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M4.99964 7.08282H5.00381" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
        </g>
        <defs>
          <clipPath id="clip0_12005_250">
            <rect fill="white" height="9.99928" width="9.99928" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-[#ff3b30] content-stretch flex items-center justify-center left-[124.01px] pr-[0.008px] rounded-[17586600px] size-[19.999px] top-[7.99px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[111.998px] left-[12px] top-[12px] w-[152.004px]" data-name="Container">
      <ImageBrh7020VRotaryHammer1 />
      <Container42 />
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[227.461px] relative rounded-[16px] shrink-0 w-[175.999px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph20 />
        <Paragraph21 />
        <Text7 />
        <Container41 />
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="absolute h-[14.995px] left-[12px] top-[142.11px] w-[152.004px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#f31a1a] text-[10px] top-[0.05px] tracking-[0.25px] uppercase">Saw</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="absolute content-stretch flex h-[16.24px] items-start left-[12px] overflow-clip top-[159.1px] w-[152.004px]" data-name="Paragraph">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.25px] not-italic relative shrink-0 text-[#1d1d1f] text-[13px]">BI-BTS125 Circular Saw</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[#fff3e0] h-[16.051px] left-[12px] rounded-[17586600px] top-[189.72px] w-[95.407px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[7.99px] not-italic text-[#b97a00] text-[10px] top-px">⚠ Expiring Soon</p>
    </div>
  );
}

function ImageBiBts125CircularSaw() {
  return (
    <div className="absolute h-[111.998px] left-[12px] rounded-[14px] top-[20.11px] w-[152.004px]" data-name="Image (BI-BTS125 Circular Saw)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgImageBiBts125CircularSaw} />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white h-[227.461px] relative rounded-[16px] shrink-0 w-[175.999px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph22 />
        <Paragraph23 />
        <Text8 />
        <ImageBiBts125CircularSaw />
      </div>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="absolute h-[14.995px] left-[12px] top-[134px] w-[152.004px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#f31a1a] text-[10px] top-[0.05px] tracking-[0.25px] uppercase">Grinder</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="absolute h-[32.479px] left-[12px] overflow-clip top-[150.99px] w-[152.004px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.25px] left-0 not-italic text-[#1d1d1f] text-[13px] top-0 w-[111px] whitespace-pre-wrap">BA618-20V Angle Grinder</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[#fee] h-[16.051px] left-[12px] rounded-[17586600px] top-[197.85px] w-[60.7px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[7.99px] not-italic text-[#c0392b] text-[10px] top-px">✗ Expired</p>
    </div>
  );
}

function ImageBa61820VAngleGrinder1() {
  return (
    <div className="absolute h-[111.998px] left-0 rounded-[14px] top-0 w-[152.004px]" data-name="Image (BA618-20V Angle Grinder)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgImageBa61820VAngleGrinder} />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[9.999px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99928 9.99928">
        <g clipPath="url(#clip0_12005_250)" id="Icon">
          <path d={svgPaths.p33b70000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M4.99964 3.74973V5.41628" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
          <path d="M4.99964 7.08282H5.00381" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833273" />
        </g>
        <defs>
          <clipPath id="clip0_12005_250">
            <rect fill="white" height="9.99928" width="9.99928" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-[#ff3b30] content-stretch flex items-center justify-center left-[124.01px] pr-[0.008px] rounded-[17586600px] size-[19.999px] top-[7.99px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute h-[111.998px] left-[12px] top-[12px] w-[152.004px]" data-name="Container">
      <ImageBa61820VAngleGrinder1 />
      <Container44 />
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white h-[227.461px] relative rounded-[16px] shrink-0 w-[175.999px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph24 />
        <Paragraph25 />
        <Text9 />
        <Container43 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[17.992px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9922 17.9922">
        <g clipPath="url(#clip0_12005_255)" id="Icon">
          <path d={svgPaths.p7fc4d00} id="Vector" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49935" />
        </g>
        <defs>
          <clipPath id="clip0_12005_255">
            <rect fill="white" height="17.9922" width="17.9922" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-[#e8f7ff] relative rounded-[17586600px] shrink-0 size-[39.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[103.891px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[52.5px] not-italic text-[#1d1d1f] text-[12px] text-center top-[0.57px]">Register New Tool</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[227.461px] relative rounded-[16px] shrink-0 w-[143.995px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#c7c7cc] border-[1.572px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.993px] items-center justify-center p-[1.572px] relative size-full">
        <Container45 />
        <Paragraph26 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex gap-[11.997px] h-[235.454px] items-start left-[-15.99px] overflow-clip pl-[15.994px] top-[33px] w-[393.092px]" data-name="Container">
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[268.457px] relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[21.997px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9968 21.9968">
        <g clipPath="url(#clip0_12005_282)" id="Icon">
          <path d={svgPaths.p2b45d40} id="Vector" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83306" />
          <path d={svgPaths.p20924000} id="Vector_2" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83306" />
        </g>
        <defs>
          <clipPath id="clip0_12005_282">
            <rect fill="white" height="21.9968" width="21.9968" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-[#e8f7ff] relative rounded-[16px] shrink-0 size-[47.998px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[22.505px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-0 not-italic text-[#1d1d1f] text-[15px] top-[-1.43px]">Find Service Centers</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[19.491px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#6c6c70] text-[13px] top-[0.57px]">{`Repair shops & distributors near you`}</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="flex-[1_0_0] h-[43.994px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-start relative size-full">
        <Paragraph27 />
        <Paragraph28 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="Icon">
          <path d={svgPaths.p1dd7f460} id="Vector" stroke="var(--stroke-0, #C7C7CC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white h-[79.986px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[15.994px] items-center px-[15.994px] relative size-full">
          <Container46 />
          <Container47 />
          <Icon13 />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f2f2f7] h-[1108px] relative shrink-0 w-full" data-name="Main Content">
      <div className="content-stretch flex flex-col gap-[23.995px] items-start pt-[19.999px] px-[15.994px] relative size-full">
        <Container7 />
        <Container20 />
        <Container25 />
        <Container38 />
        <Button11 />
      </div>
    </div>
  );
}

function T() {
  return (
    <div className="bg-[#f2f2f7] content-stretch flex flex-col h-[1282px] items-start pt-[10px] relative shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="T0">
      <Container />
      <MainContent />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-[#f4f7f9] content-stretch flex flex-col h-[852.224px] items-start left-0 top-0 w-[393.092px]" data-name="Body">
      <T />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[23.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.995 23.995">
        <g id="Icon">
          <path d={svgPaths.p30a23e28} id="Vector" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99958" />
          <path d={svgPaths.p3ee1d480} id="Vector_2" stroke="var(--stroke-0, #F31A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99958" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[31.3px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[16px] not-italic text-[#f31a1a] text-[11px] text-center top-[0.57px]">Home</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="flex-[1_0_0] h-[48.481px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.996px] items-center pb-[3.996px] relative size-full">
        <Icon14 />
        <Text10 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[23.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.995 23.995">
        <g id="Icon">
          <path d={svgPaths.p34c22100} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49969" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[47.155px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[24.5px] not-italic text-[#8e8e93] text-[11px] text-center top-[0.57px]">My Tools</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="flex-[1_0_0] h-[48.481px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.996px] items-center pb-[3.996px] relative size-full">
        <Icon15 />
        <Text11 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="bg-[#f31a1a] relative rounded-[17586600px] shadow-[0px_4px_16px_0px_rgba(0,174,239,0.45),0px_0px_0px_0px_white] shrink-0 size-[61.994px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
        <div className="h-[34px] relative shrink-0 w-[35px]" data-name="add">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute inset-[20.83%]" data-name="icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4167 19.8333">
                <path d={svgPaths.p1fc11370} fill="var(--fill-0, #FEF7FF)" id="icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[18.492px] relative shrink-0 w-[26.714px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[13px] not-italic text-[#f31a1a] text-[11px] text-center top-[0.57px]">Add Tool</p>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="flex-[1_0_0] h-[84.482px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.996px] items-center relative size-full">
        <Container49 />
        <Text12 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[23.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.995 23.995">
        <g id="Icon">
          <path d={svgPaths.p3683a080} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49969" />
        </g>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[41.529px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[21px] not-italic text-[#8e8e93] text-[11px] text-center top-[0.57px]">Support</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="flex-[1_0_0] h-[48.481px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.996px] items-center pb-[3.996px] relative size-full">
        <Icon16 />
        <Text13 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[23.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.995 23.995">
        <g id="Icon">
          <path d={svgPaths.p35240a80} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49969" />
          <path d={svgPaths.p1d496a00} id="Vector_2" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49969" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[33.388px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[17px] not-italic text-[#8e8e93] text-[11px] text-center top-[0.57px]">Profile</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="flex-[1_0_0] h-[48.481px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.996px] items-center pb-[3.996px] relative size-full">
        <Icon17 />
        <Text14 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[64.475px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end justify-between pl-[15.994px] pr-[15.986px] relative size-full">
          <Button12 />
          <Button13 />
          <Button14 />
          <Button15 />
          <Button16 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col items-start left-0 shadow-[0px_-1px_0px_0px_rgba(0,0,0,0.08)] top-[1196px] w-[393.092px]" data-name="Navigation">
      <Container48 />
    </div>
  );
}

export default function BeiterOsMobileAppCopyCopyCopy() {
  return (
    <div className="bg-white relative size-full" data-name="BeiterOs Mobile App (Copy) (Copy) (Copy)">
      <Body />
      <Navigation />
    </div>
  );
}