using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearTree.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoListToArtistsButWeTryAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroPhotoUrl",
                table: "Artists",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Tagline",
                table: "Artists",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "otherPhotos",
                table: "Artists",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Manufacturer",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherPhotos",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "RelatedAmps",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "SpeakerConfiguration",
                table: "Amplifiers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Wattage",
                table: "Amplifiers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "priceEnd",
                table: "Amplifiers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "priceStart",
                table: "Amplifiers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroPhotoUrl",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "Tagline",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "otherPhotos",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "Manufacturer",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "OtherPhotos",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "RelatedAmps",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "SpeakerConfiguration",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "Wattage",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "priceEnd",
                table: "Amplifiers");

            migrationBuilder.DropColumn(
                name: "priceStart",
                table: "Amplifiers");
        }
    }
}
