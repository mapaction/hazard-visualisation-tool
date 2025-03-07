.PHONY: run
run:
	flask --app main --debug run

mask:
	@echo "Running mask.."
	@cd hazard-processing-tool && poetry run python -m src.prepare_hazard_mask

compute:
	@echo "Running compute.."
	@cd hazard-processing-tool && poetry run python -m src.compute_hazard

pipeline:	mask compute
