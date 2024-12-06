import { describe, it, expect } from "vitest";
import { TodoFactory } from "../../../src/domain/todo";
import { InputParseError } from "../../../src/domain/errors";

describe("TodoFactory", () => {
    it("creates a todo", () => {
        const todo = TodoFactory({ id: "1", title: "Test" });
        expect(todo.id).toBe("1");
        expect(todo.title).toBe("Test");
    });

    it("throws an error if the id is not a string", () => {
        // @ts-expect-error - we want to test the error
        expect(() => TodoFactory({ title: "Test" })).toThrow(InputParseError);
    });

    it("throws an error if the title is not a string", () => {
        // @ts-expect-error - we want to test the error
        expect(() => TodoFactory({ id: "1" })).toThrow(InputParseError);
    });

    it("throws an error if the title is empty", () => {
        expect(() => TodoFactory({ id: "1", title: "" })).toThrow(InputParseError);
    });
});
