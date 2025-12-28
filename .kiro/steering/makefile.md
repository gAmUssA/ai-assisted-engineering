# Makefile Implementation Guidelines

## 1.3 Makefile Implementation

**Rationale**: Following user preferences for GNU Make with Davis-Hansson best practices <https://tech.davis-hansson.com/p/make/>, providing an excellent developer experience with visual enhancements.

### Required Preamble

Every Makefile MUST start with this exact preamble (per user rules):

```makefile
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
.RECIPEPREFIX = >

# GNU Make 4.0+ version check
ifeq ($(origin .RECIPEPREFIX), undefined)
$(error This Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
```

### Implementation Rules

1. **Always use the required preamble** - Never modify or omit any part of it
2. **Use `>` for recipe prefixes** instead of tabs (enforced by `.RECIPEPREFIX = >`)
3. **Follow Davis-Hansson best practices** for robust, maintainable Makefiles
4. **Include version checking** to ensure GNU Make 4.0+ compatibility
5. **Use strict shell settings** for better error handling and debugging

### Best Practices

- Use `.ONESHELL` for multi-line commands that need to share state
- Leverage `.DELETE_ON_ERROR` for automatic cleanup on failures
- Use `--warn-undefined-variables` to catch typos early
- Disable built-in rules with `--no-builtin-rules` for cleaner output
- Use bash with strict error handling via `.SHELLFLAGS`

### Visual Enhancements

- Use consistent formatting and indentation
- Add helpful comments for complex targets
- Group related targets together
- Use descriptive target names that clearly indicate their purpose

This approach ensures robust, maintainable Makefiles that provide an excellent developer experience while following established best practices.
