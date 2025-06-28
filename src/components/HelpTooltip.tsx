import { useState } from "react";
import "./HelpTooltip.css";

interface HelpTooltipProps {
    content: string;
    position?: "top" | "bottom" | "left" | "right";
    children: React.ReactNode;
}

const HelpTooltip = ({ content, position = "top", children }: HelpTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="help-tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}
        >
            {children}
            {isVisible && (
                <div className={`help-tooltip help-tooltip-${position}`}>
                    <div className="help-tooltip-content">
                        {content}
                    </div>
                    <div className={`help-tooltip-arrow help-tooltip-arrow-${position}`}></div>
                </div>
            )}
        </div>
    );
};

export default HelpTooltip;
