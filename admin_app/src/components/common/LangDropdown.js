import React from 'react'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const LangDropdown = (props) => {

    let langOptions = Object.values(props.languages).map(l => {
        return (
            <option value={l.code}>{l.code}</option>
        )
    })
    return (
        // only show if type is 2 - custom translations; 1 is google translation
        props.translationsType == 2 ? (
        <div className="row">
            <div className="col-sm-12">
                <div className="form-group">
                    <select className="form-control" id="currLang" type="text"  name="currLang"
                        disabled={props.isDisabled}
                        onChange={props.currLangOnChange} value={props.currLang}>
                        {langOptions}
                    </select>
                </div>
            </div>
        </div>
        )
        :
        ""
    )
}

const mapStateToProps = state => {

    let translationsType = 1; //state.settings.settings['translations_type'] && state.settings.settings['translations_type'].value || 2

    return {
        translationsType: translationsType

    }
};

export default connect(mapStateToProps, {})(LangDropdown);
// export default ;