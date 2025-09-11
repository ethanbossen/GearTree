using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearTree.Migrations
{
    /// <inheritdoc />
    public partial class AddSummaryToArtistAndAmplifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Summary",
                table: "Amplifiers");
        }
    }
}
