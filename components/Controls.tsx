import { useContext } from "react";
import { FaTrashCan } from "react-icons/fa6"
import Checkbox from "./input/Checkbox";
import ToggleGroup from "./input/ToggleGroup";
import IconButton from "./input/IconButton";
import { useDeleteCompletedTasks } from "@/hooks/useDeleteCompletedTasks";
import { useToggleAllComplete } from "@/hooks/useToggleAllComplete";
import { AllCompleteContext } from "./TodoContainer";

const Controls = () => {
    const {setDeleteCompleted} = useDeleteCompletedTasks();
    const {setToggleAll} = useToggleAllComplete();
    const allCompleteContext = useContext(AllCompleteContext);
    const allComplete = allCompleteContext?.allComplete || false;

    return (
        <div id="controls">
            <Checkbox
                checked={allComplete}
                onEventDispatch={() => setToggleAll(true)}
            />
            <ToggleGroup />
            <IconButton
                Icon={FaTrashCan}
                buttonType="DELETE_COMPLETED"
                hide={false}
                onEventDispatch={() => setDeleteCompleted(true)}
            />
        </div>
    );
}

export default Controls;