import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../styles/react-autosuggest.css';

interface AutocompleteProps<T> {
    defaultValue?: string;
    displayNameSelector: (item: T) => string;
    search: (searchText: string) => Promise<T[]>;
    onItemSelected: (item: T) => void;
    onChange?: (value: string) => void;
    resetOnSelect?: boolean;
    searchDelayInMilliseconds?: number;
    minSearchTextLength?: number;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}
interface AutocompleteState<T> {
    searchText: string;
    suggestions: T[];
    selectedItem: T | null;
}

export class Autocomplete<T> extends Component<AutocompleteProps<T>, AutocompleteState<T>> {
    searchTimer?: NodeJS.Timeout;

    constructor(props: AutocompleteProps<T>) {
        super(props);

        this.state = { 
            searchText: props.defaultValue ?? '',
            suggestions: [],
            selectedItem: null
        };
    }

    onItemSelected = (item: any) => {
        if(this.props.onItemSelected) {
            this.props.onItemSelected(item);
        }
        if(this.props.resetOnSelect) {
            this.setState({ 
                searchText: '', 
                suggestions: [], 
                selectedItem: null 
            });
        } else {
            const itemDisplayName = this.props.displayNameSelector ? this.props.displayNameSelector(item) : item;
            this.setState({ 
                searchText: itemDisplayName,
                selectedItem: item
            });
        }
    }

    runSearch = (searchText: string) => {
        const localSearchText = searchText.trim();
        if(this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(async () => {
            const searchResults = await this.props.search(localSearchText);
            this.setState({
                suggestions: searchResults
            });
        }, this.props.searchDelayInMilliseconds ?? 500);
    }

    render() {
        return (
            <Autosuggest
                getSuggestionValue={this.props.displayNameSelector}
                suggestions={this.state.suggestions}
                inputProps={{
                    value: this.state.searchText,
                    onChange: (_e, { newValue }) => {
                        this.setState({ searchText: newValue });
                        if(this.props.onChange) {
                            this.props.onChange(newValue);
                        }
                    },
                    placeholder: this.props.placeholder ?? 'Enter search text',
                    className: 'form-control',
                    disabled: this.props.disabled,
                    required: this.props.required
                }}
                renderSuggestion={item => (
                    <div>{this.props.displayNameSelector(item)}</div>
                )}
                onSuggestionsFetchRequested={({ value }) => this.runSearch(value)}
                onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
                shouldRenderSuggestions={(value) => value ? value.trim().length >= (this.props.minSearchTextLength ?? 3) : false}
                onSuggestionSelected={this.props.onItemSelected ? (_e, { suggestion }) => this.props.onItemSelected(suggestion) : undefined}
            />
        );
    }

}