"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationCountAttribute = void 0;
var tslib_1 = require("tslib");
var QueryBuilderUtils_1 = require("../QueryBuilderUtils");
var ObjectUtils_1 = require("../../util/ObjectUtils");
var TypeORMError_1 = require("../../error/TypeORMError");
var RelationCountAttribute = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RelationCountAttribute(expressionMap, relationCountAttribute) {
        this.expressionMap = expressionMap;
        ObjectUtils_1.ObjectUtils.assign(this, relationCountAttribute || {});
    }
    Object.defineProperty(RelationCountAttribute.prototype, "joinInverseSideMetadata", {
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        get: function () {
            return this.relation.inverseEntityMetadata;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "parentAlias", {
        /**
         * Alias of the parent of this join.
         * For example, if we join ("post.category", "categoryAlias") then "post" is a parent alias.
         * This value is extracted from entityOrProperty value.
         * This is available when join was made using "post.category" syntax.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.relationName))
                throw new TypeORMError_1.TypeORMError("Given value must be a string representation of alias property");
            return this.relationName.split(".")[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "relationProperty", {
        /**
         * Relation property name of the parent.
         * This is used to understand what is joined.
         * For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
         * This value is extracted from entityOrProperty value.
         * This is available when join was made using "post.category" syntax.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.relationName))
                throw new TypeORMError_1.TypeORMError("Given value is a string representation of alias property");
            return this.relationName.split(".")[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "junctionAlias", {
        get: function () {
            var _a = (0, tslib_1.__read)(this.relationName.split("."), 2), parentAlias = _a[0], relationProperty = _a[1];
            return parentAlias + "_" + relationProperty + "_rc";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "relation", {
        /**
         * Relation of the parent.
         * This is used to understand what is joined.
         * This is available when join was made using "post.category" syntax.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.relationName))
                throw new TypeORMError_1.TypeORMError("Given value is a string representation of alias property");
            var _a = (0, tslib_1.__read)(this.relationName.split("."), 2), parentAlias = _a[0], propertyPath = _a[1];
            var relationOwnerSelection = this.expressionMap.findAliasByName(parentAlias);
            var relation = relationOwnerSelection.metadata.findRelationWithPropertyPath(propertyPath);
            if (!relation)
                throw new TypeORMError_1.TypeORMError("Relation with property path ".concat(propertyPath, " in entity was not found."));
            return relation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "metadata", {
        /**
         * Metadata of the joined entity.
         * If table without entity was joined, then it will return undefined.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.relationName))
                throw new TypeORMError_1.TypeORMError("Given value is a string representation of alias property");
            var parentAlias = this.relationName.split(".")[0];
            var selection = this.expressionMap.findAliasByName(parentAlias);
            return selection.metadata;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelationCountAttribute.prototype, "mapToPropertyPropertyName", {
        get: function () {
            return this.mapToProperty.split(".")[1];
        },
        enumerable: false,
        configurable: true
    });
    return RelationCountAttribute;
}());
exports.RelationCountAttribute = RelationCountAttribute;

//# sourceMappingURL=RelationCountAttribute.js.map
