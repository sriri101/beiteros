import imgRectangle1 from "figma:asset/c17c8118f33e6928fa17a0b70b2b43e839ec2e17.png";
import imgRectangle2 from "figma:asset/d779115b24209fe7cb5fdd1d6fa5375c2cd4de43.png";
import { imgRectangle } from "./svg-vnofc";

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

export default function Container() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[24px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-full" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 174, 239) 0%, rgb(0, 137, 192) 100%)" }}>
      <ClipPathGroup />
    </div>
  );
}