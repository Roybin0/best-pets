import { useRef, useState, useEffect } from 'react'

const useClickOutsideToggle = (excludeRefs = []) => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            let isExcludedClick = false;

            for (const excludeRef of excludeRefs) {
                if (
                    excludeRef.current &&
                    excludeRef.current.contains(event.target)
                ) {
                    isExcludedClick = true;
                    break;
                }
            }

            if (ref.current && !ref.current.contains(event.target) && !isExcludedClick) {
                setExpanded(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [excludeRefs]);

    return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle