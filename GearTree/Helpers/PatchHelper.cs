using System;
using System.Collections;
using System.Linq;

namespace GearTree.Helpers
{
    public static class PatchHelper
    {
        public static void ApplyPatch<TTarget, TSource>(this TTarget target, TSource source)
        {
            if (target == null || source == null) return;

            var targetProps = typeof(TTarget).GetProperties()
                .Where(p => p.CanRead && p.CanWrite);

            var sourceProps = typeof(TSource).GetProperties()
                .Where(p => p.CanRead);

            foreach (var tProp in targetProps)
            {
                var sProp = sourceProps.FirstOrDefault(p => p.Name == tProp.Name);
                if (sProp == null) continue;

                var newValue = sProp.GetValue(source);
                if (newValue == null) continue;

                // Skip empty strings
                if (tProp.PropertyType == typeof(string) && string.IsNullOrWhiteSpace(newValue as string))
                    continue;

                // Handle nullable / non-nullable types
                var targetType = Nullable.GetUnderlyingType(tProp.PropertyType) ?? tProp.PropertyType;

                // Handle list of strings
                if (typeof(IEnumerable<string>).IsAssignableFrom(targetType) &&
                    newValue is IEnumerable enumerableValue)
                {
                    var list = enumerableValue.Cast<string>().ToList();
                    tProp.SetValue(target, list);
                    continue;
                }
                if (targetType.IsPrimitive || targetType.IsEnum)
                {
                    try
                    {
                        var safeValue = Convert.ChangeType(newValue, targetType);
                        tProp.SetValue(target, safeValue);
                        continue;
                    }
                    catch
                    {
                        continue;
                    }
                }
                // Fallback: assign directly if compatible
                if (targetType.IsAssignableFrom(newValue.GetType()))
                {
                    tProp.SetValue(target, newValue);
                }
            }
        }
    }
}
