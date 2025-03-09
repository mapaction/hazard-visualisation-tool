"""Streamlit front end for the hazard tool."""

import streamlit as st
from src.back_end import ( prepare_hazard_mask, 
                          compute_hazard )

st.title('Hazard Processing Tool')

st.write('This tool processes hazard data to create a hazard mask.')
prepare = prepare_hazard_mask.main()
st.write(prepare)

st.write("Select a hazard to compute:")
hazard_types = ["coastal_erosion", "cyclone", "deforestation", "earthquake", "flood", "landslide"]
hazard_choice = st.selectbox("Hazard Type", hazard_types)

if st.button("Run Analysis"):
    st.write(f"Running analysis for: {hazard_choice}")
    result_df = compute_hazard.run_analysis(hazard_choice)
    st.dataframe(result_df)
    st.session_state['result_df'] = result_df
    st.session_state['hazard_choice'] = hazard_choice

if st.button("Export CSV"):
    if 'result_df' in st.session_state and 'hazard_choice' in st.session_state:
        compute_hazard.export_dataset(st.session_state['result_df'], st.session_state['hazard_choice'])
        st.write("CSV exported successfully!")
    else:
        st.write("Please run an analysis first!")
