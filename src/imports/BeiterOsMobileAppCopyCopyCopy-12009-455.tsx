import svgPaths from "./svg-3dsxe0siqt";
import imgImageBeiterOsLogo from "figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png";

function Container() {
  return <div className="absolute bg-[#ff6a6a] left-[145.09px] opacity-10 rounded-[17586600px] size-[287.997px] top-[-86px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-[#ff6a6a] left-[-67px] opacity-10 rounded-[17586600px] size-[223.997px] top-[600.23px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="Icon">
          <path d={svgPaths.p20d19900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[17586600px] shrink-0 size-[35.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[13.996px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9957 13.9957">
        <g clipPath="url(#clip0_12009_465)" id="Icon">
          <path d={svgPaths.p10423000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
          <path d={svgPaths.p1d352100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
          <path d="M1.16631 6.99786H12.8294" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
        </g>
        <defs>
          <clipPath id="clip0_12009_465">
            <rect fill="white" height="13.9957" width="13.9957" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[16.493px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[27.5px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-center top-[0.57px]">🇬🇧 English</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[11.997px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9975 11.9975">
        <g id="Icon">
          <path d={svgPaths.p12563d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="0.999791" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[35.992px] relative rounded-[17586600px] shrink-0 w-[115.07px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.995px] items-center px-[11.997px] relative size-full">
        <Icon1 />
        <Text />
        <Icon2 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[7.993px] h-[91.984px] items-center justify-end left-0 pr-[15.994px] top-0 w-[393.092px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function ImageBeiterOsLogo() {
  return (
    <div className="h-[75.99px] relative shrink-0 w-full" data-name="Image (BeiterOs Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageBeiterOsLogo} />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[156.55px] overflow-clip pl-[3.996px] pr-[3.21px] pt-[1.998px] rounded-[21.6px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-[79.994px] top-[125.76px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(243, 26, 26) 0%, rgb(255, 106, 106) 100%)" }}>
      <ImageBeiterOsLogo />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[41.799px] left-[117.44px] top-[225.76px] w-[158.203px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Black',sans-serif] font-black leading-[41.8px] left-[79.5px] not-italic text-[38px] text-center text-white top-[-0.1px] tracking-[-0.95px]">BeiterOs</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[17.992px] left-[32.6px] top-[277.56px] w-[327.88px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[164.5px] not-italic text-[12px] text-[rgba(255,255,255,0.62)] text-center top-[0.57px]">{`"The ecosystem that links it all the way it supposed to be"`}</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex h-[55.999px] items-center justify-center relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(29,29,31,0.32)] shrink-0 w-full" data-name="Button" style={{ backgroundImage: "linear-gradient(178.63deg, rgb(243, 26, 26) 5.476%, rgb(255, 106, 106) 94.524%)" }}>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[25.5px] not-italic relative shrink-0 text-[17px] text-center text-white">Sign In</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex h-[55.999px] items-center justify-center p-[1.048px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.048px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25.5px] not-italic relative shrink-0 text-[17px] text-center text-white">Create Account</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.997px] h-[123.996px] items-start left-[23.99px] top-[339.54px] w-[345.102px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[589.302px] left-0 top-[91.98px] w-[393.092px]" data-name="Container">
      <Container5 />
      <Heading />
      <Paragraph />
      <Container6 />
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[148.81px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔒 Warranty Protection</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[124.897px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">📱 QR Registration</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[115.676px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🏅 Earn Rewards</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[154.42px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔧 Maintenance Tracker</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[112.547px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">⚡ Tool Scanner</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[148.81px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔒 Warranty Protection</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[124.897px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">📱 QR Registration</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[115.676px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🏅 Earn Rewards</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[154.42px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔧 Maintenance Tracker</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[112.547px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">⚡ Tool Scanner</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[7.993px] h-[27px] items-start relative shrink-0 w-full" data-name="Container">
      <Text1 />
      <Text2 />
      <Text3 />
      <Text4 />
      <Text5 />
      <Text6 />
      <Text7 />
      <Text8 />
      <Text9 />
      <Text10 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[26.992px] relative shrink-0 w-[393.092px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[-24.159px] pr-[24.159px] relative rounded-[inherit] size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[112.711px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🧾 Receipt Vault</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[140.277px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🤖 AI Tool Assistance</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[139.138px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🗺️ Repair Shops Map</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[106.716px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">📊 Usage Stats</p>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[109.845px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🌟 Pro Features</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[112.711px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🧾 Receipt Vault</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[140.277px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🤖 AI Tool Assistance</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[139.138px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🗺️ Repair Shops Map</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[106.716px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">📊 Usage Stats</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[109.845px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🌟 Pro Features</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[7.993px] h-[27px] items-start relative shrink-0 w-full" data-name="Container">
      <Text11 />
      <Text12 />
      <Text13 />
      <Text14 />
      <Text15 />
      <Text16 />
      <Text17 />
      <Text18 />
      <Text19 />
      <Text20 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[26.992px] relative shrink-0 w-[393.092px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[-128.246px] pr-[128.246px] relative rounded-[inherit] size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[135.232px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">{`💡 Tips & Reminders`}</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[146.828px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔗 Compatibility Guide</p>
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[131.285px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🎯 Daily Challenges</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[144.576px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🛡️ Extended Warranty</p>
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[135.232px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">{`💡 Tips & Reminders`}</p>
      </div>
    </div>
  );
}

function Text26() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[146.828px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🔗 Compatibility Guide</p>
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[131.285px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🎯 Daily Challenges</p>
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[26.992px] relative rounded-[100px] shrink-0 w-[144.576px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14.524px] py-[0.524px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.8)]">🛡️ Extended Warranty</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[7.993px] h-[27px] items-start relative shrink-0 w-full" data-name="Container">
      <Text21 />
      <Text22 />
      <Text23 />
      <Text24 />
      <Text25 />
      <Text26 />
      <Text27 />
      <Text28 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[26.992px] relative shrink-0 w-[393.092px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[-7.181px] pr-[7.181px] relative rounded-[inherit] size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.993px] h-[112.957px] items-start left-0 top-[681.29px] w-[393.092px]" data-name="Container">
      <Container8 />
      <Container10 />
      <Container12 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[17.992px] left-0 top-[802.24px] w-[393.092px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[196.38px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center top-[0.57px]">BeiterOS v1.0 · By Beiterools.com</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[852.224px] left-0 top-0 w-[393.092px]" data-name="Container">
      <Container3 />
      <Container4 />
      <Container7 />
      <Paragraph1 />
    </div>
  );
}

export default function BeiterOsMobileAppCopyCopyCopy() {
  return (
    <div className="relative size-full" data-name="BeiterOs Mobile App (Copy) (Copy) (Copy)" style={{ backgroundImage: "linear-gradient(119.657deg, rgb(103, 49, 49) 45.601%, rgb(132, 0, 0) 87.982%), linear-gradient(90deg, rgb(244, 247, 249) 0%, rgb(244, 247, 249) 100%)" }}>
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}