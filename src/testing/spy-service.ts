import { EMPTY } from 'rxjs';

/**
 * Creates a jasmine spy object whose methods return an empty observable by default.
 * Individual return values can be overridden via `returnValues`.
 */
export function spyService<T>(
  name: string,
  methods: (keyof T & string)[],
  returnValues: Partial<Record<keyof T & string, unknown>> = {},
): jasmine.SpyObj<T> {
  const spy = jasmine.createSpyObj(name, methods as string[]) as Record<string, jasmine.Spy>;
  for (const method of methods) {
    spy[method].and.returnValue(method in returnValues ? returnValues[method] : EMPTY);
  }
  return spy as unknown as jasmine.SpyObj<T>;
}
