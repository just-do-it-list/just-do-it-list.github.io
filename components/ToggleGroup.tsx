import { FilterContext } from './TodoContainer';
import { useContext } from 'react';
import { FaThumbtack, FaListUl, FaO, FaCircleCheck } from 'react-icons/fa6';

const ToggleGroup = () => {
    const buttonStyle = "m-0 cursor-pointer w-10 md:w-14 p-[4px] md:px-3 md:py-2 text-xs md:text-sm appearance-none border-y-2 border-r-2 border-solid border-[#007AFF]";
    const firstButton = "border-l-2 border-solid border-[#007AFF] rounded-l-md";
    const lastButton = "rounded-r-md";
    const inactiveStyle = "bg-transparent text-[#007AFF]";
    const activeStyle = "bg-[#007AFF] text-white"
    const buttonLabels = ["All", "Pinned", "Pending", "Completed"];
    const buttonIcons = [FaListUl, FaThumbtack, FaO, FaCircleCheck];

    const filterContext = useContext(FilterContext);
    const activeTab = filterContext?.activeTab || 'All';
    const setActiveTab = filterContext?.setActiveTab || (() => '');

    return (
        <div className="flex-auto">
            {buttonLabels.map((label, index) => {
                const isFirst = index === 0 && firstButton;
                const isLast = index === (buttonLabels.length - 1) && lastButton;
                const isActive = activeTab === label ? activeStyle : inactiveStyle;
                const Icon = buttonIcons[index];
                return (
                    <button
                        key={label}
                        className={`${buttonStyle} ${isFirst} ${isLast} ${isActive}`}
                        onClick={() => setActiveTab(label)}
                    >
                        <Icon 
                            className='scale-125 md:scale-[140%] mx-auto'
                        />
                    </button>
                )
            })}
        </div>
    );
}

export default ToggleGroup;