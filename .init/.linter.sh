#!/bin/bash
cd /home/kavia/workspace/code-generation/timescale-data-management-system-cca26bbf/express_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

