namespace GearTree.Helpers
{
public static class PatchHelper
{
   public static void ApplyPatch<TTarget, TSource>(this TTarget target, TSource source)
{
    var targetProps = typeof(TTarget).GetProperties()
        .Where(p => p.CanRead && p.CanWrite);

    var sourceProps = typeof(TSource).GetProperties()
        .Where(p => p.CanRead);

    foreach (var tProp in targetProps)
    {
        var sProp = sourceProps.FirstOrDefault(p => p.Name == tProp.Name && tProp.PropertyType.IsAssignableFrom(p.PropertyType));
        if (sProp == null) continue;

        var newValue = sProp.GetValue(source);
        if (newValue == null) continue;

        if (tProp.PropertyType == typeof(string) &&
            string.IsNullOrWhiteSpace(newValue as string))
            continue;

        tProp.SetValue(target, newValue);
    }
}

}
}