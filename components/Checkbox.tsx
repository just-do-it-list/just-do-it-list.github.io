type checkboxProps = {
    rounded?: boolean;
    checked?: boolean;
    onEventDispatch: any;
}

const Checkbox = ({rounded = false, checked = false, onEventDispatch}: checkboxProps) => {
    return (
        <div className="w-9 md:w-12">
            <input
                type="checkbox"
                className={`${rounded ? 'rounded-full' : 'rounded-lg'}`}
                onClick={onEventDispatch}
                onChange={() => ''}
                checked={checked}
            />
        </div>
    )
}

export default Checkbox;