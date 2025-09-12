using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GearTree.Migrations
{
    /// <inheritdoc />
    public partial class SeedGuitarRelations3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "GuitarRelation",
                columns: new[] { "GuitarId", "RelatedGuitarId" },
                values: new object[,]
                {
                    { 2, 4 },
                    { 4, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GuitarRelation",
                keyColumns: new[] { "GuitarId", "RelatedGuitarId" },
                keyValues: new object[] { 2, 4 });

            migrationBuilder.DeleteData(
                table: "GuitarRelation",
                keyColumns: new[] { "GuitarId", "RelatedGuitarId" },
                keyValues: new object[] { 4, 2 });
        }
    }
}
