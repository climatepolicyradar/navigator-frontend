/**
 * Type definitions for IntelliSearch component
 * This component provides intelligent search with dual-source suggestions:
 * 1. Labels API - external search results
 * 2. Concepts - local data with definitions and alternative labels
 */

import { TTopic } from "../../../types/topics";

/**
 * Label result from the /search/labels API endpoint
 */
export type TLabelResult = {
  id: string;
  title: string;
  type: string;
};

/**
 * Response structure from /search/labels API
 */
export type TLabelsResponse = {
  results: TLabelResult[];
};

/**
 * Concept type - reusing existing TTopic type
 */
export type TConcept = TTopic;

/**
 * Unified suggestion type using discriminated union
 * Allows us to handle both labels and concepts in a single list
 */
export type TSuggestion =
  | {
      type: "label";
      data: TLabelResult;
    }
  | {
      type: "concept";
      data: TTopic;
      matchedLabel?: string; // If matched on alternative label, store it here
    };

/**
 * Props for the main IntelliSearch component
 */
export interface IntelliSearchProps {
  /** Optional className for custom styling */
  className?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number;
  /** Maximum number of suggestions to display */
  maxSuggestions?: number;
  /** List of concepts to search through */
  topics: TTopic[];
  /** Concept labels already selected as filters; exclude these from suggestions */
  selectedTopics?: string[];
  /** Called when the user selects a concept suggestion (adds to Active filters) */
  onSelectConcept?: (concept: TTopic) => void;
}

/**
 * Props for individual suggestion items
 */
export interface SuggestionItemProps {
  suggestion: TSuggestion;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

/**
 * Props for the concept preview card
 */
export interface ConceptPreviewProps {
  concept: TTopic;
  isVisible: boolean;
}
