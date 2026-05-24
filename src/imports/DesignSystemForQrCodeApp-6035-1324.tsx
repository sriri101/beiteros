import svgPaths from "./svg-3qrwo8ysf4";
import imgRectangle1 from "figma:asset/c17c8118f33e6928fa17a0b70b2b43e839ec2e17.png";
import imgRectangle2 from "figma:asset/d779115b24209fe7cb5fdd1d6fa5375c2cd4de43.png";
import { imgRectangle } from "./svg-ihhcv";

function Group3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-[65px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0.027px_0px] mask-size-[62.569px_65px] ml-0 mt-0 relative row-1 w-[62.622px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle1} />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <Group3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <Group2 />
    </div>
  );
}

function Group5() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-[65px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0.027px_0px] mask-size-[62.569px_65px] ml-0 mt-0 relative row-1 w-[62.622px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle2} />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <Group5 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Mask group">
      <Group1 />
      <Group4 />
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[-0.04%] mt-0 place-items-start relative row-1" data-name="Group">
      <MaskGroup />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[149.99px] rounded-[24px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-[79.994px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 174, 239) 0%, rgb(0, 137, 192) 100%)" }}>
      <ClipPathGroup />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[56.998px] left-[110.88px] top-[95.99px] w-[158.203px]" data-name="Heading 1">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[57px] left-0 not-italic text-[38px] text-white top-[0.24px] tracking-[-0.95px]">BeiterOs</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[22.505px] left-[115.62px] top-[169px] w-[148.728px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[74px] not-italic text-[12px] text-[rgba(255,255,255,0.62)] text-center top-[-12px]">{`“The  ecosystem that links it all the way it supposed to be”`}</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[205.473px] left-px top-[-20px] w-[379.973px]" data-name="Container">
      <Container2 />
      <Heading />
      <Paragraph />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[55.999px] left-0 rounded-[16px] top-[193px] w-[379.973px]" data-name="Button" style={{ backgroundImage: "linear-gradient(171.616deg, rgb(0, 174, 239) 0%, rgb(0, 137, 192) 100%)" }}>
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[25.5px] left-[190.27px] not-italic text-[17px] text-center text-white top-[15.35px]">Sign In</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute border-[1.572px] border-[rgba(255,255,255,0.3)] border-solid h-[55.999px] left-0 rounded-[16px] top-[261px] w-[379.973px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25.5px] left-[188.85px] not-italic text-[17px] text-center text-white top-[13.77px]">Create Account</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[317px] left-[16px] top-[244px] w-[380px]" data-name="Container">
      <Container1 />
      <Button />
      <Button1 />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[#00aeef] left-[210.36px] opacity-10 rounded-[17586600px] size-[288px] top-[-86.4px]" data-name="Container" />;
}

function Container4() {
  return <div className="absolute bg-[#00aeef] left-[-67.2px] opacity-10 rounded-[17586600px] size-[224px] top-[760.42px]" data-name="Container" />;
}

function Paragraph1() {
  return (
    <div className="absolute h-[17.992px] left-[10px] top-[847px] w-[392.273px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[196.25px] not-italic text-[12px] text-center text-white top-[0.57px]">BeiterOS v1.0 · By Beiterools.com</p>
    </div>
  );
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

function Button2() {
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
        <g clipPath="url(#clip0_6005_55)" id="Icon">
          <path d={svgPaths.p10423000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
          <path d={svgPaths.p1d352100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
          <path d="M1.16631 6.99786H12.8294" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
        </g>
        <defs>
          <clipPath id="clip0_6005_55">
            <rect fill="white" height="13.9957" width="13.9957" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[53.092px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[27.5px] not-italic text-[11px] text-center text-white top-[0.57px]">🇬🇧 English</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[11.997px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9975 11.9975">
        <g id="Icon">
          <path d={svgPaths.p12563d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999791" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[35.992px] relative rounded-[17586600px] shrink-0 w-[111.073px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.996px] items-center pl-[11.997px] relative size-full">
        <Icon1 />
        <Text />
        <Icon2 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[7.993px] h-[35.992px] items-center left-[232.91px] top-[50px] w-[155.058px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[25px] left-[138px] opacity-70 rounded-[17586600px] top-[650px] w-[144px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[24px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Ai Tool Assistance</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[24.486px] left-[297px] opacity-70 rounded-[17586600px] top-[650px] w-[119.852px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[60.06px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-center top-[4.57px]">Repair Shops Map</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[24.486px] left-[-21px] opacity-70 rounded-[17586600px] top-[651px] w-[143.765px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[36.82px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Receipt Vault</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[25px] left-[63px] opacity-70 rounded-[17586600px] top-[686px] w-[144px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[24px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Tips and Reminders</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[25px] left-[221px] opacity-70 rounded-[17586600px] top-[686px] w-[120px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[8px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Compatibility Guide</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[24.486px] left-[9px] opacity-70 rounded-[17586600px] top-[610px] w-[143.765px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[18.82px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Warranty Protection</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[24.486px] left-[166px] opacity-70 rounded-[17586600px] top-[610px] w-[119.852px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[60.06px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-center top-[4.57px]">QR Registration</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] h-[25px] left-[299px] opacity-70 rounded-[17586600px] top-[610px] w-[120px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[24px] not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-[4.57px]">Earn Rewards</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[-21px] top-[610px]">
      <Text1 />
      <Text2 />
      <Text3 />
      <Text4 />
      <Text5 />
      <Text6 />
      <Text7 />
      <Text8 />
    </div>
  );
}

export default function DesignSystemForQrCodeApp() {
  return (
    <div className="relative size-full" data-name="Design System for QR Code App" style={{ backgroundImage: "linear-gradient(140.989deg, rgb(0, 43, 73) 8.4861%, rgb(0, 64, 112) 50%, rgb(0, 174, 239) 91.514%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Container />
      <Container3 />
      <Container4 />
      <Paragraph1 />
      <Container5 />
      <Group6 />
    </div>
  );
}