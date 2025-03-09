"""Streamlit front end for the hazard tool."""

import streamlit as st
from src.back_end import ( prepare_hazard_mask, 
                          compute_hazard )

st.title('Hazard Processing Tool')

st.write('This tool processes hazard data to create a hazard mask.')
prepare = prepare_hazard_mask.main()
st.write(prepare)

st.write('This tool computes the exposed population.')
compute = compute_hazard.main()
st.write(compute)

if st.button('Process Hazard'):
    st.write('Hazard Processed')