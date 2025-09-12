using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearTree.Migrations
{
    /// <inheritdoc />
    public partial class SeedGuitarRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RelatedAmps",
                table: "Amplifiers");

            migrationBuilder.RenameColumn(
                name: "otherPhotos",
                table: "Artists",
                newName: "OtherPhotos");

            migrationBuilder.CreateTable(
                name: "AmplifierRelation",
                columns: table => new
                {
                    AmplifierId = table.Column<int>(type: "INTEGER", nullable: false),
                    RelatedAmplifierId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmplifierRelation", x => new { x.AmplifierId, x.RelatedAmplifierId });
                    table.ForeignKey(
                        name: "FK_AmplifierRelation_Amplifiers_AmplifierId",
                        column: x => x.AmplifierId,
                        principalTable: "Amplifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmplifierRelation_Amplifiers_RelatedAmplifierId",
                        column: x => x.RelatedAmplifierId,
                        principalTable: "Amplifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GuitarRelation",
                columns: table => new
                {
                    GuitarId = table.Column<int>(type: "INTEGER", nullable: false),
                    RelatedGuitarId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuitarRelation", x => new { x.GuitarId, x.RelatedGuitarId });
                    table.ForeignKey(
                        name: "FK_GuitarRelation_Guitars_GuitarId",
                        column: x => x.GuitarId,
                        principalTable: "Guitars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuitarRelation_Guitars_RelatedGuitarId",
                        column: x => x.RelatedGuitarId,
                        principalTable: "Guitars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AmplifierRelation_RelatedAmplifierId",
                table: "AmplifierRelation",
                column: "RelatedAmplifierId");

            migrationBuilder.CreateIndex(
                name: "IX_GuitarRelation_RelatedGuitarId",
                table: "GuitarRelation",
                column: "RelatedGuitarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AmplifierRelation");

            migrationBuilder.DropTable(
                name: "GuitarRelation");

            migrationBuilder.RenameColumn(
                name: "OtherPhotos",
                table: "Artists",
                newName: "otherPhotos");

            migrationBuilder.AddColumn<string>(
                name: "RelatedAmps",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
