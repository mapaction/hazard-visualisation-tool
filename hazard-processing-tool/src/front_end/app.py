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
    st.write("Analysis Result:")
    st.dataframe(result_df) 