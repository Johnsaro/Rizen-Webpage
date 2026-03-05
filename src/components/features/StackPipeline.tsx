import React from 'react';
import './StackPipeline.css';

interface StackPipelineProps {
    tags: string[];
    buildTitle: string;
}

// Define layer priorities for sorting (lower number = earlier in the pipeline)
const LAYER_MAPPING: Record<string, number> = {
    // Backend & Databases (Layer 1)
    'Python': 1,
    'Supabase': 1,
    'PostgreSQL': 1,

    // APIs & Services (Layer 2)
    'Automation': 2,
    'Cybersecurity': 2,
    'Forensics': 2,

    // Frontend & Platforms (Layer 3)
    'Flutter': 3,
    'React': 3,
    'Desktop': 3,
    'Win32': 3,
    'Dart': 3,
};

const StackPipeline: React.FC<StackPipelineProps> = ({ tags, buildTitle }) => {
    // Sort tags based on defined layers, fallback to 4 if unknown
    const sortedTags = [...tags].sort((a, b) => {
        const layerA = LAYER_MAPPING[a] || 4;
        const layerB = LAYER_MAPPING[b] || 4;
        return layerA - layerB;
    });

    // The final destination conceptually
    const pipelineNodes = [...sortedTags];

    return (
        <div className="stack-pipeline-container" aria-label="Technology Stack Pipeline">
            {pipelineNodes.map((tag) => (
                <React.Fragment key={tag}>
                    {/* Node */}
                    <div className="pipeline-node" title={`This build is powered by ${tag}`}>
                        <span className="pipeline-tag-text">{tag}</span>
                    </div>

                    {/* Connector to next node or to final build */}
                    <div className="pipeline-connector">
                        <div className="pipeline-line"></div>
                        <div className="pipeline-packet"></div>
                    </div>
                </React.Fragment>
            ))}

            {/* Final Build Output Node */}
            <div className="pipeline-node pipeline-node--final" title={`Output: ${buildTitle}`}>
                <span className="pipeline-tag-text pipeline-tag-text--glow">SYSTEM</span>
            </div>
        </div>
    );
};

export default StackPipeline;
