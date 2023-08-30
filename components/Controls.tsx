import Checkbox from "./Checkbox";
import ToggleGroup from "./ToggleGroup";
import IconButton from "./IconButton";
import { FaTrashCan } from "react-icons/fa6"
import { useDeleteCompletedTasks } from "@/hooks/useDeleteCompletedTasks";
import { useToggleAllComplete } from "@/hooks/useToggleAllComplete";
import { AllCompleteContext } from "./TodoContainer";
import { useContext } from "react";

const Controls = ({manageTaskList}: any) => {
    const {setDeleteCompleted} = useDeleteCompletedTasks(manageTaskList);
    const {setToggleAll} = useToggleAllComplete(manageTaskList);
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