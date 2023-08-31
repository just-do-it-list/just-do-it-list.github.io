import { FilterContext } from '../TodoContainer';
import { useContext } from 'react';
import { FaThumbtack, FaListUl, FaO, FaCircleCheck } from 'react-icons/fa6';

const ToggleGroup = () => {
    const activeStyle = "bg-[#007AFF] text-white";
    const inactiveStyle = "bg-transparent text-[#007AFF]";
    const buttonLabels = ["All", "Pinned", "Pending", "Completed"];
    const buttonIcons = [FaListUl, FaThumbtack, FaO, FaCircleCheck];

    const filterContext = useContext(FilterContext);
    const activeTab = filterContext?.activeTab || 'All';
    const setActiveTab = filterContext?.setActiveTab || (() => '');

    return (
        <div className="flex-auto" id="toggle-group">
            {buttonLabels.map((label, index) => {
                const buttonStyle = activeTab === label ? activeStyle : inactiveStyle;
                const Icon = buttonIcons[index];
                return (
                    <button
                        key={label}
                        className={buttonStyle}
                        onClick={() => setActiveTab(label)}
                    >
                        <Icon className='scale-125 md:scale-[140%] mx-auto'/>
                    </button>
                )
            })}
        </div>
    );
}

export default ToggleGroup;